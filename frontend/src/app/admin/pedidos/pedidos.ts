import { Component, inject, signal } from '@angular/core';
import { StoreApiService } from '../../core/store-api.service';
import type { ApiOrder } from '../../core/api.models';
import { mensagemErroApi } from '../../core/api-error';

type StatusPedido = 'Aguardando' | 'Em trânsito' | 'Entregue' | 'Cancelado';

interface PedidoAdmin {
  id: number;
  codigo: string;
  cliente: string;
  email: string;
  data: string;
  total: number;
  itens: number;
  status: StatusPedido;
}

@Component({
  imports: [],
  selector: 'app-pedidos',
  styleUrl: './pedidos.scss',
  templateUrl: './pedidos.html',
})
export class Pedidos {
  private readonly api = inject(StoreApiService);
  readonly pedidos = signal<PedidoAdmin[]>([]);
  readonly erro = signal('');
  readonly filtros = ['Todos', 'Aguardando', 'Em trânsito', 'Entregue', 'Cancelado'] as const;
  readonly filtroAtivo = signal<string>('Todos');
  readonly busca = signal('');
  readonly pedidoSelecionado = signal<PedidoAdmin | null>(null);

  constructor() {
    this.api.listOrders().subscribe({
      next: (orders) => this.pedidos.set(orders.map((order) => this.mapOrder(order))),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível carregar os pedidos.'))
    });
  }

  get pedidosFiltrados(): PedidoAdmin[] {
    const busca = this.busca().trim().toLocaleLowerCase('pt-BR');
    return this.pedidos().filter((pedido) => {
      const combinaFiltro = this.filtroAtivo() === 'Todos' || pedido.status === this.filtroAtivo();
      const combinaBusca = !busca || `${pedido.codigo} ${pedido.cliente} ${pedido.email}`.toLocaleLowerCase('pt-BR').includes(busca);
      return combinaFiltro && combinaBusca;
    });
  }

  atualizarBusca(event: Event): void {
    const elemento = event.target;

    if (elemento instanceof HTMLInputElement) {
      this.busca.set(elemento.value);
    }
  }

  alterarStatus(id: number, event: Event): void {
    const elemento = event.target;

    if (!(elemento instanceof HTMLSelectElement)) {
      return;
    }

    const valor = elemento.value;
    const status = (['Aguardando', 'Em trânsito', 'Entregue', 'Cancelado'] as const)
      .find((opcao) => opcao === valor);

    if (!status) {
      return;
    }

    const apiStatusByUi: Record<StatusPedido, ApiOrder['status']> = {
      Aguardando: 'pendente',
      'Em trânsito': 'enviado',
      Entregue: 'entregue',
      Cancelado: 'cancelado'
    };
    const apiStatus = apiStatusByUi[status];
    this.api.updateOrderStatus(id, apiStatus).subscribe({
      next: (order) => {
        const atualizado = this.mapOrder(order);
        this.pedidos.update((orders) => orders.map((pedido) => pedido.id === id ? atualizado : pedido));
        if (this.pedidoSelecionado()?.id === id) {
          this.pedidoSelecionado.set(atualizado);
        }
        this.erro.set('');
      },
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível atualizar o pedido.'))
    });
  }

  verPedido(pedido: PedidoAdmin): void {
    this.pedidoSelecionado.set(pedido);
  }

  fecharDetalhes(): void {
    this.pedidoSelecionado.set(null);
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  private mapOrder(order: ApiOrder): PedidoAdmin {
    const statusByApi: Record<ApiOrder['status'], StatusPedido> = {
      pendente: 'Aguardando',
      confirmado: 'Aguardando',
      enviado: 'Em trânsito',
      entregue: 'Entregue',
      cancelado: 'Cancelado'
    };
    const status = statusByApi[order.status];
    return {
      id: order.id,
      codigo: `#EL-${order.id}`,
      cliente: order.shipping_name ?? order.user?.name ?? 'Cliente',
      email: order.shipping_email ?? order.user?.email ?? '',
      data: new Intl.DateTimeFormat('pt-BR').format(new Date(order.created_at)),
      total: Number(order.total),
      itens: order.items_count ?? 0,
      status
    };
  }
}
