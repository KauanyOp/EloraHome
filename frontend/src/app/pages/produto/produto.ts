import { Component, inject, signal } from '@angular/core';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';

@Component({
  selector: 'app-produto',
  imports: [],
  templateUrl: './produto.html',
  styleUrl: './produto.scss'
})
export class Produto {
  private readonly carrinho = inject(CarrinhoService);
  readonly quantidade = signal(1);

  produto = {
    id: 1,
    nome: 'Travesseiro Plumas de Ganso',
    preco: 114,
    imagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85',
    descricao: 'Produto premium para conforto e decoração.'
  };

  atualizarQuantidade(event: Event): void {
    const valor = Number((event.target as HTMLInputElement).value);
    this.quantidade.set(Number.isFinite(valor) ? Math.max(1, valor) : 1);
  }

  adicionarAoCarrinho(): void {
    this.carrinho.adicionar(this.produto, this.quantidade());
  }
}