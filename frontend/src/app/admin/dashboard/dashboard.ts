import { Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StoreApiService } from '../../core/store-api.service';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly api = inject(StoreApiService);
  readonly erro = signal('');
  readonly metricas = signal([
    { titulo: 'Vendas no mês', valor: '—', detalhe: 'Total de pedidos deste mês', icone: 'R$' },
    { titulo: 'Pedidos', valor: '—', detalhe: 'Pedidos aguardando processamento', icone: '↗' },
    { titulo: 'Produtos ativos', valor: '—', detalhe: 'Produtos com estoque baixo', icone: '□' }
  ]);
  readonly barras = signal<{ periodo: string; valor: number }[]>([]);

  constructor() {
    forkJoin({
      orders: this.api.listOrders(),
      products: this.api.listAdminProducts()
    }).subscribe({
      next: ({ orders, products }) => {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const salesThisMonth = orders
          .filter((order) => new Date(order.created_at) >= firstOfMonth)
          .reduce((total, order) => total + Number(order.total), 0);
        const activeProducts = products.filter((product) => product.status);
        const lowStock = activeProducts.filter((product) => product.stock <= 5).length;
        const pendingOrders = orders.filter((order) => order.status === 'pendente').length;
        const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        this.metricas.set([
          { titulo: 'Vendas no mês', valor: currency.format(salesThisMonth), detalhe: 'Total de pedidos deste mês', icone: 'R$' },
          { titulo: 'Pedidos', valor: String(orders.length), detalhe: `${pendingOrders} aguardando processamento`, icone: '↗' },
          { titulo: 'Produtos ativos', valor: String(activeProducts.length), detalhe: `${lowStock} com estoque baixo`, icone: '□' }
        ]);
        this.barras.set(this.salesByDay(orders, now));
      },
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível carregar os indicadores da loja.'))
    });
  }

  private salesByDay(orders: { created_at: string; total: string | number }[], now: Date) {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setDate(date.getDate() + 1);
      const total = orders
        .filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt >= date && createdAt < dayEnd;
        })
        .reduce((sum, order) => sum + Number(order.total), 0);
      return { periodo: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date), total };
    });
    const maximum = Math.max(0, ...days.map((day) => day.total));

    return days.map((day) => ({
      periodo: day.periodo,
      valor: maximum > 0 ? day.total / maximum * 100 : 0
    }));
  }
}
