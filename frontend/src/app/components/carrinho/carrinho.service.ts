import { computed, Injectable, signal } from '@angular/core';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  readonly aberto = signal(false);
  readonly itens = signal<ItemCarrinho[]>([]);
  readonly quantidade = computed(() =>
    this.itens().reduce((total, item) => total + item.quantidade, 0)
  );
  readonly total = computed(() =>
    this.itens().reduce((valor, item) => valor + item.preco * item.quantidade, 0)
  );

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
    this.itens.update((itens) => {
      const existente = itens.find((item) => item.id === produto.id);

      if (existente) {
        return itens.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }

      return [...itens, { ...produto, quantidade }];
    });
    this.abrir();
  }

  atualizarQuantidade(id: number, quantidade: number): void {
    if (quantidade < 1) {
      this.remover(id);
      return;
    }

    this.itens.update((itens) =>
      itens.map((item) => item.id === id ? { ...item, quantidade } : item)
    );
  }

  remover(id: number): void {
    this.itens.update((itens) => itens.filter((item) => item.id !== id));
  }

  limpar(): void {
    this.itens.set([]);
    this.fechar();
  }
}
