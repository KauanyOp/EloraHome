import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import type { ProdutoCatalogo } from '../produtos/catalogo';
import { StoreApiService } from '../../core/store-api.service';
import { mapearProduto } from '../../core/product-mapper';

@Component({
  selector: 'app-produto',
  imports: [RouterLink],
  templateUrl: './produto.html',
  styleUrl: './produto.scss'
})
export class Produto {
  private readonly route = inject(ActivatedRoute);
  private readonly carrinho = inject(CarrinhoService);
  private readonly api = inject(StoreApiService);
  readonly quantidade = signal(1);
  readonly produto = signal<ProdutoCatalogo | null>(null);
  readonly erro = signal('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.produto.set(null);
      this.quantidade.set(1);
      this.api.getProduct(id).subscribe({
        next: (produto) => this.produto.set(mapearProduto(produto)),
        error: () => this.erro.set('Não foi possível carregar o produto. Tente novamente.')
      });
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