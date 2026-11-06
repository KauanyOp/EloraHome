import { Component } from '@angular/core';

@Component({
  selector: 'app-produto',
  imports: [],
  templateUrl: './produto.html',
  styleUrl: './produto.scss'
})
export class Produto {

  produto = {
    nome: 'Travesseiro Plumas de Ganso',
    preco: 114,
    descricao: 'Produto premium para conforto e decoração.'
  };

}