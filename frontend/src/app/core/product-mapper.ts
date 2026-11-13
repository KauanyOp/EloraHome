import type { ApiProduct } from './api.models';
import type { ProdutoCatalogo } from '../pages/produtos/catalogo';

export function slugCategoria(nome: string): string {
  return nome.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, '-');
}

export function mapearProduto(produto: ApiProduct): ProdutoCatalogo {
  const categoria = slugCategoria(produto.category?.name ?? 'outros');

  return {
    id: produto.id,
    nome: produto.name,
    preco: Number(produto.price),
    categoria,
    comodos: ['quarto', 'sala', 'banheiro', 'cozinha'].includes(categoria) ? [categoria] : [],
    imagem: produto.image || '/img/produtos/jogo-de-cama.png',
    alt: produto.description || produto.name
  };
}
