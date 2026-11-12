export interface ProdutoCatalogo {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  comodos: string[];
  imagem: string;
  alt: string;
  novo?: boolean;
}

export const catalogoProdutos: ProdutoCatalogo[] = [
  {
    id: 1,
    nome: 'Jogo de cama em algodão',
    preco: 279,
    categoria: 'quarto',
    comodos: ['quarto'],
    imagem: '/img/produtos/jogo-de-cama.png',
    alt: 'Cama arrumada com roupa clara'
  },
  {
    id: 2,
    nome: 'Kit de talheres em aço',
    preco: 89,
    categoria: 'cozinha',
    comodos: ['cozinha'],
    imagem: '/img/produtos/Kit-talheres.jpg',
    alt: 'Mesa posta com talheres'
  },
  {
    id: 3,
    nome: 'Conjunto de Almofadas',
    preco: 179,
    categoria: 'decoracao',
    comodos: ['sala'],
    imagem: '/img/produtos/Almofadas.jpg',
    alt: '3 almofadas decorativas'
  },
  {
    id: 4,
    nome: 'Jogo de cama Verde-Sálvia',
    preco: 49,
    categoria: 'quarto',
    comodos: ['quarto'],
    imagem: '/img/produtos/Jogo-de-cama-verde.jpg',
    alt: 'Jogo de cama verde sobre a cama'
  },
  {
    id: 5,
    nome: 'Toalhas macias de banho',
    preco: 119,
    categoria: 'banheiro',
    comodos: ['banheiro'],
    imagem: '/img/produtos/Toalhas-banho.jpg',
    alt: 'Toalhas de banho dobradas'
  },
  {
    id: 6,
    nome: 'Cesto organizador',
    preco: 99,
    categoria: 'organizacao',
    comodos: ['cozinha'],
    imagem: '/img/produtos/Cesta-organizadora.jpg',
    alt: 'Cesto organizador'
  },
  {
    id: 7,
    nome: 'Jogo de xícaras',
    preco: 79,
    categoria: 'cozinha',
    comodos: ['cozinha'],
    imagem: '/img/produtos/Jogo-de-xicaras.jpg',
    alt: 'Jogo de xícaras de porcelana'
  },
  {
    id: 8,
    nome: 'Espelho redondo para banheiro',
    preco: 189,
    categoria: 'decoracao',
    comodos: ['banheiro'],
    imagem: '/img/produtos/Espelho-banheiro.jpg',
    alt: 'Espelho redondo decorativo sobre bancada de banheiro'
  },
  {
    id: 9,
    nome: 'Cobertor azul',
    preco: 219,
    categoria: 'Quarto',
    comodos: ['quarto'],
    imagem: '/img/produtos/Coberta-azul.jpg',
    alt: 'Cobertor azul sobre a cama'
  },
  {
    id: 10,
    nome: 'Vasos decorativos',
    preco: 119,
    categoria: 'decoracao',
    comodos: ['sala'],
    imagem: '/img/produtos/Vasos-decorativos.jpg',
    alt: 'Vasos decorativos de cerâmica'
  },
  {
    id: 11,
    nome: 'Quadros decorativos',
    preco: 149,
    categoria: 'decoracao',
    comodos: ['sala'],
    imagem: '/img/produtos/Quadro-decorativos.jpg',
    alt: 'Conjunto de quadros em molduras de madeira'
  },
  {
    id: 12,
    nome: 'Tapetes para banho',
    preco: 95,
    categoria: 'banheiro',
    comodos: ['banheiro'],
    imagem: '/img/produtos/Tapetes-banheiro.jpg',
    alt: 'Tapetes macios'
  }
];
