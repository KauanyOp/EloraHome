import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly metricas = [
    { titulo: 'Vendas no mês', valor: 'R$ 24.650,00', detalhe: '+12,8% em relação ao mês passado', icone: 'R$' },
    { titulo: 'Pedidos', valor: '38', detalhe: '7 aguardando processamento', icone: '↗' },
    { titulo: 'Produtos ativos', valor: '14', detalhe: '2 com estoque baixo', icone: '□' }
  ];

  readonly barras = [
    { periodo: 'Mai 06', valor: 48 },
    { periodo: 'Mai 10', valor: 72 },
    { periodo: 'Mai 14', valor: 39 },
    { periodo: 'Mai 18', valor: 88 },
    { periodo: 'Mai 22', valor: 56 },
    { periodo: 'Mai 26', valor: 75 },
    { periodo: 'Mai 30', valor: 46 }
  ];
}
