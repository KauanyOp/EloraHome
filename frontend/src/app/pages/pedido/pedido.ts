import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PedidoService } from './pedido.service';
import { StoreApiService } from '../../core/store-api.service';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-pedido',
  styleUrl: './pedido.scss',
  templateUrl: './pedido.html',
})
export class Pedido {
  readonly pedido = inject(PedidoService);
  private readonly api = inject(StoreApiService);
  readonly erro = signal('');
  readonly etapas = [
    'Pedido confirmado',
    'Pagamento confirmado',
    'Em preparação',
    'A caminho',
    'Entregue'
  ];

  constructor() {
    if (this.pedido.atual()) {
      return;
    }
    this.api.listMyOrders().subscribe({
      next: (orders) => {
        if (orders.length) {
          this.pedido.criarDaApi(orders[0]);
        }
      },
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Entre na sua conta para acompanhar seus pedidos.'))
    });
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(valor: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium'
    }).format(new Date(valor));
  }
}
