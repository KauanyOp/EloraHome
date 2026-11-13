import { Component, input, output, type OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ProdutoAdmin {
  id: number;
  nome: string;
  categoria: string;
  categoriaId: number | null;
  preco: number;
  estoque: number;
  status: 'Ativo' | 'Inativo';
  descricao?: string;
  imagem?: string | null;
}

interface CategoriaOpcao {
  id: number;
  name: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-editar-produto',
  styleUrl: './editar-produto.scss',
  templateUrl: './editar-produto.html',
})
export class EditarProduto implements OnChanges {
  readonly produto = input<ProdutoAdmin | null>(null);
  readonly categorias = input<CategoriaOpcao[]>([]);
  readonly salvo = output<ProdutoAdmin>();
  readonly cancelar = output<void>();

  dados: ProdutoAdmin = this.dadosVazios();

  ngOnChanges(): void {
    const produto = this.produto();
    this.dados = produto ? { ...produto } : this.dadosVazios();
  }

  salvar(): void {
    const categoria = this.categorias().find((item) => item.id === this.dados.categoriaId);

    this.salvo.emit({
      ...this.dados,
      nome: this.dados.nome.trim(),
      categoria: categoria?.name ?? ''
    });
  }

  private dadosVazios(): ProdutoAdmin {
    return {
      id: 0,
      nome: '',
      categoria: '',
      categoriaId: null,
      preco: 0,
      estoque: 0,
      status: 'Ativo'
    };
  }
}
