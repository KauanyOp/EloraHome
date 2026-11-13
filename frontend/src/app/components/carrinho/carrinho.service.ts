import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { mensagemErroApi } from '../../core/api-error';
import type { ApiCart } from '../../core/api.models';
import { AuthService } from '../../core/auth.service';
import { StoreApiService } from '../../core/store-api.service';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly auth = inject(AuthService);
  private readonly api = inject(StoreApiService);
  private readonly itensVisitante = signal<ItemCarrinho[]>([]);
  private usuarioAtivo: number | null = null;
  private filaSincronizacao: Promise<void> = Promise.resolve();
  private operacoesPendentes = 0;

  readonly aberto = signal(false);
  readonly itens = signal<ItemCarrinho[]>([]);
  readonly erro = signal('');
  readonly sincronizando = signal(false);
  readonly quantidade = computed(() =>
    this.itens().reduce((total, item) => total + item.quantidade, 0)
  );
  readonly total = computed(() =>
    this.itens().reduce(
      (centavos, item) => centavos + Math.round(item.preco * 100) * item.quantidade,
      0
    ) / 100
  );

  private readonly sessaoEffect = effect(() => {
    const user = this.auth.user();
    const token = this.auth.token();

    if (user) {
      this.ativarCarrinhoDoUsuario(user.id);
    } else if (!token) {
      this.usuarioAtivo = null;
      this.itens.set(this.itensVisitante());
      this.erro.set('');
    }
  });

  abrir(): void {
    this.aberto.set(true);
  }

  fechar(): void {
    this.aberto.set(false);
  }

  alternar(): void {
    this.aberto.update((aberto) => !aberto);
  }

  adicionar(produto: Omit<ItemCarrinho, 'quantidade'>, quantidade = 1): void {
    const userId = this.usuarioAtual();
    this.itens.update((itens) => this.adicionarItem(itens, produto, quantidade));
    this.abrir();

    if (userId === null) {
      this.itensVisitante.update((itens) => this.adicionarItem(itens, produto, quantidade));
      return;
    }

    this.erro.set('');
    this.enfileirar(userId, () => firstValueFrom(this.api.addCartItem({
      product_id: produto.id,
      quantity: quantidade,
    })));
  }

  atualizarQuantidade(id: number, quantidade: number): void {
    if (quantidade < 1) {
      this.remover(id);
      return;
    }

    const userId = this.usuarioAtual();
    this.itens.update((itens) =>
      itens.map((item) => item.id === id ? { ...item, quantidade } : item)
    );

    if (userId === null) {
      this.itensVisitante.update((itens) =>
        itens.map((item) => item.id === id ? { ...item, quantidade } : item)
      );
      return;
    }

    this.erro.set('');
    this.enfileirar(userId, () =>
      firstValueFrom(this.api.setCartItemQuantity(id, quantidade))
    );
  }

  remover(id: number): void {
    const userId = this.usuarioAtual();
    this.itens.update((itens) => itens.filter((item) => item.id !== id));

    if (userId === null) {
      this.itensVisitante.update((itens) => itens.filter((item) => item.id !== id));
      return;
    }

    this.erro.set('');
    this.enfileirar(userId, () => firstValueFrom(this.api.removeCartItem(id)));
  }

  limpar(): void {
    const userId = this.usuarioAtual();
    this.itens.set([]);
    this.itensVisitante.set([]);
    this.fechar();

    if (userId === null) {
      return;
    }

    this.erro.set('');
    this.enfileirar(userId, () => firstValueFrom(this.api.clearCart()));
  }

  async sincronizar(): Promise<void> {
    this.erro.set('');
    const userId = this.auth.user()?.id;
    if (userId !== undefined) {
      this.ativarCarrinhoDoUsuario(userId);
    }

    await this.filaSincronizacao;
  }

  private usuarioAtual(): number | null {
    const userId = this.auth.user()?.id ?? null;
    if (userId !== null) {
      this.ativarCarrinhoDoUsuario(userId);
    }
    return userId;
  }

  private ativarCarrinhoDoUsuario(userId: number): void {
    if (this.usuarioAtivo === userId) {
      return;
    }

    this.usuarioAtivo = userId;
    this.itens.set([]);
    this.erro.set('');
    this.enfileirar(userId, async () => {
      const cart = await firstValueFrom(this.api.getCart());
      if (!this.ehUsuarioAtual(userId)) {
        return;
      }
      this.aplicarCarrinho(cart);

      for (const item of this.itensVisitante()) {
        try {
          const updatedCart = await firstValueFrom(this.api.addCartItem({
            product_id: item.id,
            quantity: item.quantidade,
          }));
          this.itensVisitante.update((itens) => itens.filter((atual) => atual.id !== item.id));
          if (!this.ehUsuarioAtual(userId)) {
            return;
          }
          this.aplicarCarrinho(updatedCart);
        } catch (error: unknown) {
          if (this.ehUsuarioAtual(userId)) {
            this.erro.set(mensagemErroApi(error, `Não foi possível sincronizar ${item.nome}.`));
            this.itensVisitante.update((itens) => itens.filter((atual) => atual.id !== item.id));
          }
        }
      }

      if (this.ehUsuarioAtual(userId)) {
        this.itens.update((itens) =>
          this.itensVisitante().reduce(
            (atualizados, item) => this.adicionarItem(atualizados, item, item.quantidade),
            itens
          )
        );
      }
    }, false);
  }

  private enfileirar(
    userId: number,
    operacao: () => Promise<ApiCart | void>,
    atualizarEmErro = true
  ): void {
    this.operacoesPendentes++;
    this.sincronizando.set(true);
    this.filaSincronizacao = this.filaSincronizacao.then(async () => {
      if (!this.ehUsuarioAtual(userId)) {
        return;
      }

      try {
        const cart = await operacao();
        if (cart !== undefined && this.ehUsuarioAtual(userId)) {
          this.aplicarCarrinho(cart);
        }
      } catch (error: unknown) {
        if (!this.ehUsuarioAtual(userId)) {
          return;
        }

        this.erro.set(mensagemErroApi(error, 'Não foi possível sincronizar o carrinho.'));
        if (atualizarEmErro) {
          try {
            const cart = await firstValueFrom(this.api.getCart());
            if (this.ehUsuarioAtual(userId)) {
              this.aplicarCarrinho(cart);
            }
          } catch (refreshError: unknown) {
            if (this.ehUsuarioAtual(userId)) {
              this.erro.set(
                `${this.erro()} ${mensagemErroApi(refreshError, 'Não foi possível atualizar o carrinho.')}`
              );
            }
          }
        }
      }
    }).finally(() => {
      this.operacoesPendentes--;
      this.sincronizando.set(this.operacoesPendentes > 0);
    });
  }

  private ehUsuarioAtual(userId: number): boolean {
    return this.auth.user()?.id === userId;
  }

  private aplicarCarrinho(cart: ApiCart): void {
    this.itens.set(cart.items.map((item) => ({
      id: item.product_id,
      nome: item.product?.name ?? 'Produto indisponível',
      preco: Number(item.unit_price),
      imagem: item.product?.image ?? '',
      quantidade: item.quantity,
    })));
  }

  private adicionarItem(
    itens: ItemCarrinho[],
    produto: Omit<ItemCarrinho, 'quantidade'>,
    quantidade: number
  ): ItemCarrinho[] {
    const existente = itens.find((item) => item.id === produto.id);
    if (existente) {
      return itens.map((item) =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      );
    }

    return [...itens, { ...produto, quantidade }];
  }
}
