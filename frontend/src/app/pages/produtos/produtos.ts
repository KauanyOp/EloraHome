import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';

interface ProdutoCatalogo {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  comodos: string[];
  imagem: string;
  alt: string;
  novo?: boolean;
}

interface FiltroCatalogo {
  label: string;
  valor: string;
  tipo: 'todos' | 'categoria' | 'comodo';
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
  readonly filtroAtivo = signal('todos');

  readonly filtros: FiltroCatalogo[] = [
    { label: 'Todos', valor: 'todos', tipo: 'todos' },
    { label: 'Cama e banho', valor: 'cama', tipo: 'categoria' },
    { label: 'Organização', valor: 'organizacao', tipo: 'categoria' },
    { label: 'Decoração', valor: 'decoracao', tipo: 'categoria' },
    { label: 'Cozinha', valor: 'cozinha', tipo: 'categoria' },
    { label: 'Quarto', valor: 'quarto', tipo: 'comodo' },
    { label: 'Sala', valor: 'sala', tipo: 'comodo' },
    { label: 'Banheiro', valor: 'banheiro', tipo: 'comodo' }
  ];

  readonly produtos: ProdutoCatalogo[] = [
    {
      id: 1,
      nome: 'Jogo de cama em algodão',
      preco: 279,
      categoria: 'cama',
      comodos: ['quarto'],
      imagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85',
      alt: 'Cama arrumada com roupa clara e almofadas'
    },
    {
      id: 2,
      nome: 'Kit de talheres em aço',
      preco: 89,
      categoria: 'cozinha',
      comodos: ['cozinha'],
      imagem: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=800&q=85',
      alt: 'Mesa posta com louças e talheres'
    },
    {
      id: 3,
      nome: 'Conjunto de Almofadas',
      preco: 179,
      categoria: 'decoracao',
      comodos: ['sala'],
      imagem: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85',
      alt: 'Almofadas decorativas em tons naturais'
    },
    {
      id: 4,
      nome: 'Vela Aromática',
      preco: 49,
      categoria: 'decoracao',
      comodos: ['sala', 'quarto'],
      imagem: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85',
      alt: 'Vela aromática acesa em um ambiente acolhedor',
      novo: true
    },
    {
      id: 5,
      nome: 'Toalhas macias de banho',
      preco: 119,
      categoria: 'cama',
      comodos: ['banheiro'],
      imagem: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=800&q=85',
      alt: 'Toalhas de banho dobradas em um banheiro claro'
    },
    {
      id: 6,
      nome: 'Cesto de fibras naturais',
      preco: 99,
      categoria: 'organizacao',
      comodos: ['quarto', 'sala'],
      imagem: 'https://images.unsplash.com/photo-1558997519-83a8e7c71550?auto=format&fit=crop&w=800&q=85',
      alt: 'Cesto organizador de fibras naturais',
      novo: true
    },
    {
      id: 7,
      nome: 'Bandeja de madeira',
      preco: 79,
      categoria: 'cozinha',
      comodos: ['cozinha', 'sala'],
      imagem: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85',
      alt: 'Objetos decorativos sobre uma bandeja de madeira'
    },
    {
      id: 8,
      nome: 'Manta de toque natural',
      preco: 189,
      categoria: 'cama',
      comodos: ['sala', 'quarto'],
      imagem: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85',
      alt: 'Manta macia em uma sala de estar',
      novo: true
    },
    {
      id: 9,
      nome: 'Luminária de mesa',
      preco: 219,
      categoria: 'decoracao',
      comodos: ['quarto', 'sala'],
      imagem: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85',
      alt: 'Luminária de mesa com luz acolhedora'
    },
    {
      id: 10,
      nome: 'Vaso orgânico em cerâmica',
      preco: 119,
      categoria: 'decoracao',
      comodos: ['sala'],
      imagem: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=85',
      alt: 'Vaso de cerâmica para decoração',
      novo: true
    },
    {
      id: 11,
      nome: 'Organizador de bancada',
      preco: 69,
      categoria: 'organizacao',
      comodos: ['cozinha', 'banheiro'],
      imagem: 'https://images.unsplash.com/photo-1558997519-83a8e7c71550?auto=format&fit=crop&w=800&q=85',
      alt: 'Organizador de objetos em fibras naturais'
    },
    {
      id: 12,
      nome: 'Tapete macio para banho',
      preco: 95,
      categoria: 'cama',
      comodos: ['banheiro'],
      imagem: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=85',
      alt: 'Tapete macio em um banheiro contemporâneo'
    }
  ];

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const filtro = params.get('comodo') ?? params.get('categoria') ?? 'todos';
      this.filtroAtivo.set(this.filtros.some((item) => item.valor === filtro) ? filtro : 'todos');
    });
  }

  get produtosFiltrados(): ProdutoCatalogo[] {
    const filtro = this.filtroAtivo();

    if (filtro === 'todos') {
      return this.produtos;
    }

    return this.produtos.filter((produto) =>
      produto.categoria === filtro || produto.comodos.includes(filtro)
    );
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
