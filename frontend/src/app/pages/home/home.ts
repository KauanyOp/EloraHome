import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  readonly destaques = [
    {
      id: 1,
      nome: 'Jogo de cama em linho',
      preco: 279,
      imagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=85',
      alt: 'Cama clara com roupa de cama macia'
    },
    {
      id: 3,
      nome: 'Conjunto de almofadas',
      preco: 129,
      imagem: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85',
      alt: 'Almofadas decorativas em tons naturais'
    },
    {
      id: 4,
      nome: 'Vela aromática âmbar',
      preco: 89,
      imagem: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85',
      alt: 'Vela aromática acesa em um ambiente acolhedor'
    },
    {
      id: 10,
      nome: 'Vaso orgânico em cerâmica',
      preco: 119,
      imagem: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=85',
      alt: 'Vaso de cerâmica para decoração'
    }
  ];

  readonly novidades = [
    {
      id: 8,
      nome: 'Manta de toque natural',
      preco: 189,
      imagem: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=85',
      alt: 'Sala decorada com tecidos em tons naturais'
    },
    {
      id: 7,
      nome: 'Bandeja de madeira',
      preco: 79,
      imagem: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=85',
      alt: 'Detalhes de decoração em madeira'
    },
    {
      id: 6,
      nome: 'Cesto organizador',
      preco: 99,
      imagem: 'https://images.unsplash.com/photo-1558997519-83a8e7c71550?auto=format&fit=crop&w=700&q=85',
      alt: 'Cesto de fibras naturais para organização'
    },
    {
      id: 9,
      nome: 'Luminária de mesa',
      preco: 219,
      imagem: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85',
      alt: 'Luminária de mesa em um quarto aconchegante'
    }
  ];

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
