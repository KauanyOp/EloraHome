import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../carrinho/carrinho.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly carrinho = inject(CarrinhoService);
  private readonly router = inject(Router);

  selecionarComodo(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const comodo = select.value;

    if (comodo) {
      void this.router.navigate(['/produtos'], { queryParams: { comodo } });
      select.value = '';
    }
  }
}