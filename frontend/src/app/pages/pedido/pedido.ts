import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PedidoService } from './pedido.service';

@Component({
  imports: [RouterLink],
  selector: 'app-pedido',
  styleUrl: './pedido.scss',
  templateUrl: './pedido.html',
})
export class Pedido {
  readonly pedido = inject(PedidoService);
  readonly etapas = [
    'Pedido confirmado',
    'Pagamento confirmado',
    'Em preparação',
    'A caminho',
    'Entregue'
  ];

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
