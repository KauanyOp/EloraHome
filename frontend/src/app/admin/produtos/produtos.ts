import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditarProduto, type ProdutoAdmin } from '../../components/editar-produto/editar-produto';
import { catalogoProdutos } from '../../pages/produtos/catalogo';

@Component({
  imports: [FormsModule, EditarProduto],
  selector: 'app-produtos',
  styleUrl: './produtos.scss',
  templateUrl: './produtos.html',
})
export class Produtos {
  readonly produtos = signal<ProdutoAdmin[]>(
    catalogoProdutos.map((produto, indice) => ({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      estoque: [18, 12, 8, 24, 6, 14][indice % 6],
      status: 'Ativo'
    }))
  );
  readonly busca = signal('');
  readonly editorAberto = signal(false);
  readonly produtoEditando = signal<ProdutoAdmin | null>(null);

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

    if (atual) {
      this.produtos.update((produtos) =>
        produtos.map((item) => item.id === atual.id ? { ...produto, id: atual.id } : item)
      );
    } else {
      const id = Math.max(0, ...this.produtos().map((item) => item.id)) + 1;
      this.produtos.update((produtos) => [...produtos, { ...produto, id }]);
    }

    this.editorAberto.set(false);
  }

  removerProduto(id: number): void {
    this.produtos.update((produtos) => produtos.filter((produto) => produto.id !== id));
  }

  formatarCategoria(categoria: string): string {
    const categorias: Record<string, string> = {
      cozinha: 'Cozinha',
      decoracao: 'Decoração',
      organizacao: 'Organização'
    };
    return categorias[categoria] ?? categoria;
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
