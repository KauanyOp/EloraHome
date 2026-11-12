import { Injectable, signal } from '@angular/core';
import type { ItemCarrinho } from '../../components/carrinho/carrinho.service';

export interface DadosEntrega {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
}

export type FormaPagamento = 'cartao' | 'pix';

export interface PedidoConfirmado {
  codigo: string;
  criadoEm: string;
  cliente: DadosEntrega;
  itens: ItemCarrinho[];
  total: number;
  pagamento: FormaPagamento;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  readonly atual = signal<PedidoConfirmado | null>(null);

  criar(
    cliente: DadosEntrega,
    itens: ItemCarrinho[],
    total: number,
    pagamento: FormaPagamento
  ): PedidoConfirmado {
    const pedido: PedidoConfirmado = {
      codigo: `EL-${Date.now().toString(36).toUpperCase()}`,
      criadoEm: new Date().toISOString(),
      cliente: { ...cliente },
      itens: itens.map((item) => ({ ...item })),
      total,
      pagamento
    };

    this.atual.set(pedido);
    return pedido;
  }
}
