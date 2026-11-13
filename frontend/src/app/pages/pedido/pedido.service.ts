import { Injectable, signal } from '@angular/core';
import type { ItemCarrinho } from '../../components/carrinho/carrinho.service';
import type { ApiOrder } from '../../core/api.models';

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

  criarDaApi(order: ApiOrder): PedidoConfirmado {
    const cliente: DadosEntrega = {
      nome: order.shipping_name ?? '',
      email: order.shipping_email ?? '',
      telefone: order.shipping_phone ?? '',
      cep: order.shipping_cep ?? '',
      endereco: order.shipping_street ?? '',
      numero: order.shipping_number ?? '',
      complemento: order.shipping_complement ?? '',
      cidade: order.shipping_city ?? '',
      estado: order.shipping_state ?? ''
    };
    const itens: ItemCarrinho[] = (order.items ?? []).map((item) => ({
      id: item.product_id,
      nome: item.product?.name ?? 'Produto indisponível',
      preco: Number(item.unit_price),
      imagem: item.product?.image ?? '',
      quantidade: item.quantity
    }));

    const pedido: PedidoConfirmado = {
      codigo: `EL-${order.id}`,
      criadoEm: order.created_at,
      cliente,
      itens,
      total: Number(order.total),
      pagamento: order.payment_method ?? 'pix'
    };

    this.atual.set(pedido);
    return pedido;
  }
}
