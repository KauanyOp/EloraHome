import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditarProduto, type ProdutoAdmin } from '../../components/editar-produto/editar-produto';
import { StoreApiService } from '../../core/store-api.service';
import type { ApiCategory, ApiProduct } from '../../core/api.models';
import { slugCategoria } from '../../core/product-mapper';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  imports: [FormsModule, EditarProduto],
  selector: 'app-produtos',
  styleUrl: './produtos.scss',
  templateUrl: './produtos.html',
})
export class Produtos {
  private readonly api = inject(StoreApiService);
  readonly produtos = signal<ProdutoAdmin[]>([]);
  readonly categorias = signal<ApiCategory[]>([]);
  readonly busca = signal('');
  readonly erro = signal('');
  readonly editorAberto = signal(false);
  readonly produtoEditando = signal<ProdutoAdmin | null>(null);

  constructor() {
    this.api.listAdminProducts().subscribe({
      next: (products) => this.produtos.set(products.map((product) => this.toAdminProduct(product))),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível carregar os produtos.'))
    });
    this.api.listCategories().subscribe({
      next: (categories) => this.categorias.set(categories),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível carregar as categorias.'))
    });
  }

  get produtosFiltrados(): ProdutoAdmin[] {
    const busca = this.busca().trim().toLocaleLowerCase('pt-BR');

    if (!busca) {
      return this.produtos();
    }

    return this.produtos().filter((produto) =>
      `${produto.nome} ${produto.categoria} ${produto.status}`.toLocaleLowerCase('pt-BR').includes(busca)
    );
  }

  novoProduto(): void {
    this.produtoEditando.set(null);
    this.editorAberto.set(true);
  }

  editarProduto(produto: ProdutoAdmin): void {
    this.produtoEditando.set(produto);
    this.editorAberto.set(true);
  }

  salvarProduto(produto: ProdutoAdmin): void {
    const atual = this.produtoEditando();
    const category = this.categorias().find((item) => item.id === produto.categoriaId);

    if (!category) {
      this.erro.set('Selecione uma categoria válida.');
      return;
    }

    const payload = {
      category_id: category.id,
      name: produto.nome,
      description: produto.descricao?.trim() || produto.nome,
      price: produto.preco,
      stock: produto.estoque,
      status: produto.status === 'Ativo',
      image: produto.imagem ?? null
    };

    if (atual) {
      this.api.updateProduct(atual.id, payload).subscribe({
        next: (saved) => {
          this.replaceProduct(saved);
          this.editorAberto.set(false);
          this.erro.set('');
        },
        error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível salvar o produto.'))
      });
    } else {
      this.api.createProduct(payload).subscribe({
        next: (saved) => {
          this.produtos.update((products) => [...products, this.toAdminProduct(saved)]);
          this.editorAberto.set(false);
          this.erro.set('');
        },
        error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível cadastrar o produto.'))
      });
    }
  }

  removerProduto(id: number): void {
    this.api.deleteProduct(id).subscribe({
      next: () => this.produtos.update((products) => products.filter((product) => product.id !== id)),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível excluir o produto.'))
    });
  }

  formatarCategoria(categoria: string): string {
    const categorias: Record<string, string> = {
      cozinha: 'Cozinha',
      decoracao: 'Decoração',
      organizacao: 'Organização',
      quarto: 'Quarto',
      sala: 'Sala',
      banheiro: 'Banheiro'
    };
    const slug = slugCategoria(categoria);
    return categorias[slug] ?? categoria;
  }

  private replaceProduct(product: ApiProduct): void {
    this.produtos.update((products) =>
      products.map((item) => item.id === product.id ? this.toAdminProduct(product) : item)
    );
  }

  private toAdminProduct(product: ApiProduct): ProdutoAdmin {
    return {
      id: product.id,
      nome: product.name,
      categoria: product.category.name,
      categoriaId: product.category_id,
      preco: Number(product.price),
      estoque: product.stock,
      status: product.status ? 'Ativo' : 'Inativo',
      descricao: product.description,
      imagem: product.image
    };
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
