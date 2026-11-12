import { Component, signal } from '@angular/core';

type StatusPedido = 'Aguardando' | 'Em trânsito' | 'Entregue' | 'Cancelado';

interface PedidoAdmin {
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
  readonly pedidos = signal<PedidoAdmin[]>([
    { codigo: '#EL-2401', cliente: 'Ana Silva', email: 'ana@email.com', data: '12/11/2026', total: 576, itens: 3, status: 'Aguardando' },
    { codigo: '#EL-2400', cliente: 'Bruno Costa', email: 'bruno@email.com', data: '11/11/2026', total: 368, itens: 2, status: 'Em trânsito' },
    { codigo: '#EL-2399', cliente: 'Camila Souza', email: 'camila@email.com', data: '10/11/2026', total: 279, itens: 1, status: 'Entregue' },
    { codigo: '#EL-2398', cliente: 'Diego Lima', email: 'diego@email.com', data: '09/11/2026', total: 458, itens: 4, status: 'Aguardando' },
    { codigo: '#EL-2397', cliente: 'Elisa Martins', email: 'elisa@email.com', data: '08/11/2026', total: 189, itens: 1, status: 'Entregue' },
    { codigo: '#EL-2396', cliente: 'Felipe Rocha', email: 'felipe@email.com', data: '07/11/2026', total: 527, itens: 3, status: 'Em trânsito' },
    { codigo: '#EL-2395', cliente: 'Giovana Alves', email: 'giovana@email.com', data: '06/11/2026', total: 119, itens: 1, status: 'Cancelado' },
    { codigo: '#EL-2394', cliente: 'Henrique Melo', email: 'henrique@email.com', data: '05/11/2026', total: 348, itens: 2, status: 'Entregue' }
  ]);
  readonly filtros = ['Todos', 'Aguardando', 'Em trânsito', 'Entregue', 'Cancelado'] as const;
  readonly filtroAtivo = signal<string>('Todos');
  readonly busca = signal('');
  readonly pedidoSelecionado = signal<PedidoAdmin | null>(null);

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

  alterarStatus(id: string, event: Event): void {
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

    this.pedidos.update((pedidos) =>
      pedidos.map((pedido) => pedido.codigo === id ? { ...pedido, status } : pedido)
    );
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
}
