import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { PedidoService } from '../../pages/pedido/pedido.service';

@Component({
  imports: [RouterLink],
  selector: 'app-confirmacao',
  styleUrl: './confirmacao.scss',
  templateUrl: './confirmacao.html',
})
export class Confirmacao {
  readonly carrinho = inject(CarrinhoService);
  readonly pedido = inject(PedidoService);
}
