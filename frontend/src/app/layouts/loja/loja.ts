import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Carrinho } from '../../components/carrinho/carrinho';

@Component({
  selector: 'app-loja',
  imports: [RouterOutlet, Header, Footer, Carrinho],
  templateUrl: './loja.html',
  styleUrl: './loja.scss'
})
export class Loja {
}
