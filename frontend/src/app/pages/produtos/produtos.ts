import { Component } from '@angular/core';

@Component({
  selector: 'app-produtos',
  imports: [],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos {

  produtos = [
    {
      id: 1,
      nome: 'Travesseiro Plumas',
      preco: 114
    },
    {
      id: 2,
      nome: 'Kit Talheres',
      preco: 89
    },
    {
      id: 3,
      nome: 'Conjunto de Almofadas',
      preco: 179
    },
    {
      id: 4,
      nome: 'Vela Aromática',
      preco: 49
    }
  ];

}