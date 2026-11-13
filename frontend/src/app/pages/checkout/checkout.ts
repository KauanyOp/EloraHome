import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { Confirmacao } from '../../components/confirmacao/confirmacao';
import { type DadosEntrega, type FormaPagamento, PedidoService } from '../pedido/pedido.service';
import { AuthService } from '../../core/auth.service';
import { StoreApiService } from '../../core/store-api.service';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  imports: [Confirmacao, FormsModule, RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.scss',
  templateUrl: './checkout.html',
})
export class Checkout {
  readonly carrinho = inject(CarrinhoService);
  private readonly auth = inject(AuthService);
  private readonly api = inject(StoreApiService);
  readonly confirmacaoAberta = signal(false);
  readonly enviando = signal(false);
  readonly erro = signal('');
  nascimento = '';
  readonly dados: DadosEntrega = {
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: ''
  };
  pagamento: FormaPagamento = 'cartao';

  private readonly pedido = inject(PedidoService);
  private readonly router = inject(Router);

  constructor() {
    const user = this.auth.user();
    if (user) {
      this.dados.nome = user.name;
      this.dados.email = user.email;
      this.dados.telefone = user.phone ?? '';
      this.dados.cep = user.cep ?? '';
      this.dados.endereco = user.street ?? '';
      this.dados.numero = user.number ?? '';
      this.dados.complemento = user.complement ?? '';
      this.dados.cidade = user.city ?? '';
      this.dados.estado = user.state ?? '';
      this.nascimento = user.birth_date ?? '';
    }
  }

  async confirmarCompra(): Promise<void> {
    if (!this.auth.token()) {
      const destino = this.carrinho.itens().length
        ? '/login?redirect=/checkout'
        : '/produtos';
      void this.router.navigateByUrl(destino);
      return;
    }

    this.erro.set('');
    this.enviando.set(true);

    try {
      if (!this.auth.user()) {
        await firstValueFrom(this.auth.currentUser());
      }

      if (!this.auth.token()) {
        void this.router.navigateByUrl('/login?redirect=/checkout');
        this.enviando.set(false);
        return;
      }

      await this.carrinho.sincronizar();
    } catch (error: unknown) {
      this.erro.set(mensagemErroApi(error, 'Não foi possível sincronizar o carrinho.'));
      this.enviando.set(false);
      return;
    }

    if (this.carrinho.erro()) {
      this.enviando.set(false);
      return;
    }

    const itens = this.carrinho.itens();
    if (!itens.length) {
      void this.router.navigateByUrl('/produtos');
      this.enviando.set(false);
      return;
    }

    this.api.createOrder({
      items: itens.map((item) => ({ product_id: item.id, quantity: item.quantidade })),
      shipping_name: this.dados.nome,
      shipping_email: this.dados.email,
      shipping_phone: this.dados.telefone,
      shipping_cep: this.dados.cep,
      shipping_street: this.dados.endereco,
      shipping_number: this.dados.numero,
      shipping_complement: this.dados.complemento,
      shipping_neighborhood: '',
      shipping_city: this.dados.cidade,
      shipping_state: this.dados.estado,
      payment_method: this.pagamento
    }).subscribe({
      next: (order) => {
        this.pedido.criarDaApi(order);
        this.carrinho.limpar();
        this.confirmacaoAberta.set(true);
        this.enviando.set(false);
      },
      error: (error: unknown) => {
        this.erro.set(mensagemErroApi(error, 'Não foi possível concluir o pedido.'));
        this.enviando.set(false);
      }
    });
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
