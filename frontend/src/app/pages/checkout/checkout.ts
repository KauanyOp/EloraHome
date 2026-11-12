import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { Confirmacao } from '../../components/confirmacao/confirmacao';
import { type DadosEntrega, type FormaPagamento, PedidoService } from '../pedido/pedido.service';

@Component({
  imports: [Confirmacao, FormsModule, RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.scss',
  templateUrl: './checkout.html',
})
export class Checkout {
  readonly carrinho = inject(CarrinhoService);
  readonly confirmacaoAberta = signal(false);
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

  async confirmarCompra(): Promise<void> {
    const itens = this.carrinho.itens();

    if (!itens.length) {
      await this.router.navigateByUrl('/produtos');
      return;
    }

    this.pedido.criar(this.dados, itens, this.carrinho.total(), this.pagamento);
    this.confirmacaoAberta.set(true);
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
