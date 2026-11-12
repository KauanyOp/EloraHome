import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { catalogoProdutos, type ProdutoCatalogo } from '../produtos/catalogo';

@Component({
  selector: 'app-produto',
  imports: [RouterLink],
  templateUrl: './produto.html',
  styleUrl: './produto.scss'
})
export class Produto {
  private readonly route = inject(ActivatedRoute);
  private readonly carrinho = inject(CarrinhoService);
  readonly quantidade = signal(1);
  readonly produto = signal<ProdutoCatalogo | null>(null);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.produto.set(catalogoProdutos.find((item) => item.id === id) ?? null);
      this.quantidade.set(1);
    });
  }

  adicionarAoCarrinho(): void {
    const produto = this.produto();

    if (produto) {
      this.carrinho.adicionar(produto, this.quantidade());
    }
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}