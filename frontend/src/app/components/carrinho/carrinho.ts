import { Component, HostListener, OnInit, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from './carrinho.service';

@Component({
  imports: [RouterLink],
  selector: 'app-carrinho',
  styleUrl: './carrinho.scss',
  templateUrl: './carrinho.html',
})
export class Carrinho implements OnInit {
  readonly embutido = input(false);
  readonly carrinho = inject(CarrinhoService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (!this.embutido()) {
      this.carrinho.abrir();
    }
  }

  @HostListener('document:keydown.escape')
  fecharComEscape(): void {
    this.fechar();
  }

  fechar(): void {
    this.carrinho.fechar();

    if (!this.embutido()) {
      void this.router.navigateByUrl('/');
    }
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
