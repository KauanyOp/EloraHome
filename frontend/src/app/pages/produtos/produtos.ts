import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import type { ProdutoCatalogo } from './catalogo';
import { StoreApiService } from '../../core/store-api.service';
import { mapearProduto } from '../../core/product-mapper';

interface FiltroCatalogo {
  label: string;
  valor: string;
  tipo: 'todos' | 'categoria' | 'comodo';
}

function normalizarBusca(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

@Component({
  selector: 'app-produtos',
  imports: [RouterLink],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly carrinho = inject(CarrinhoService);
  private readonly api = inject(StoreApiService);
  readonly filtroAtivo = signal('todos');
  readonly busca = signal('');
  readonly produtos = signal<ProdutoCatalogo[]>([]);
  readonly erro = signal('');

  readonly filtros: FiltroCatalogo[] = [
    { label: 'Todos', valor: 'todos', tipo: 'todos' },
    { label: 'Organização', valor: 'organizacao', tipo: 'categoria' },
    { label: 'Decoração', valor: 'decoracao', tipo: 'categoria' },
    { label: 'Cozinha', valor: 'cozinha', tipo: 'categoria' },
    { label: 'Quarto', valor: 'quarto', tipo: 'comodo' },
    { label: 'Sala', valor: 'sala', tipo: 'comodo' },
    { label: 'Banheiro', valor: 'banheiro', tipo: 'comodo' }
  ];

  constructor() {
    this.api.listProducts().subscribe({
      next: (produtos) => this.produtos.set(produtos.map(mapearProduto)),
      error: () => this.erro.set('Não foi possível carregar os produtos. Tente novamente.')
    });
    this.route.queryParamMap.subscribe((params) => {
      const filtro = params.get('comodo') ?? params.get('categoria') ?? 'todos';
      this.busca.set(params.get('q')?.trim() ?? '');
      this.filtroAtivo.set(this.filtros.some((item) => item.valor === filtro) ? filtro : 'todos');
    });
  }

  get produtosFiltrados(): ProdutoCatalogo[] {
    const filtro = this.filtroAtivo();
    const termo = normalizarBusca(this.busca());

    return this.produtos().filter((produto) => {
      const combinaFiltro = filtro === 'todos' ||
        produto.categoria === filtro ||
        produto.comodos.includes(filtro);
      const camposBusca = normalizarBusca(
        `${produto.nome} ${produto.categoria} ${produto.comodos.join(' ')}`
      );

      return combinaFiltro && (!termo || camposBusca.includes(termo));
    });
  }

  selecionarFiltro(filtro: FiltroCatalogo): void {
    this.filtroAtivo.set(filtro.valor);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        categoria: filtro.tipo === 'categoria' ? filtro.valor : null,
        comodo: filtro.tipo === 'comodo' ? filtro.valor : null
      },
      queryParamsHandling: 'merge'
    });
  }

  limparBusca(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
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
