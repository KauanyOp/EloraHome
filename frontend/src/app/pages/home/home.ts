import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import type { ProdutoCatalogo } from '../produtos/catalogo';
import { StoreApiService } from '../../core/store-api.service';
import { mapearProduto } from '../../core/product-mapper';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private readonly carrinho = inject(CarrinhoService);
  private readonly api = inject(StoreApiService);
  readonly produtos = signal<ProdutoCatalogo[]>([]);
  readonly erro = signal('');

  constructor() {
    this.api.listProducts().subscribe({
      next: (produtos) => this.produtos.set(produtos.map(mapearProduto)),
      error: () => this.erro.set('Não foi possível carregar os produtos em destaque.')
    });
  }

  get destaques(): ProdutoCatalogo[] {
    return this.produtos().slice(0, 4);
  }

  get novidades(): ProdutoCatalogo[] {
    return this.produtos().slice(4, 8);
  }

  adicionarAoCarrinho(produto: ProdutoCatalogo): void {
    this.carrinho.adicionar({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem
    });
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
