import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { catalogoProdutos } from '../produtos/catalogo';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private readonly carrinho = inject(CarrinhoService);

  readonly destaques = [
    catalogoProdutos[0],
    catalogoProdutos[2],
    catalogoProdutos[3],
    catalogoProdutos[9]
  ];

  readonly novidades = [
    catalogoProdutos[10],
    catalogoProdutos[7],
    catalogoProdutos[6],
    catalogoProdutos[5]
  ];

  adicionarAoCarrinho(produto: (typeof catalogoProdutos)[number]): void {
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
