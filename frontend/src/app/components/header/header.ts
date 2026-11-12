import { Component, HostBinding, inject, signal } from '@angular/core';
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
  readonly buscaAberta = signal(false);
  readonly termoBusca = signal('');
  private readonly router = inject(Router);

  @HostBinding('class.checkout-header-host')
  get checkoutHeaderHost(): boolean {
    return ['/checkout', '/pedido'].includes(this.router.url.split('?')[0]);
  }

  get checkoutHeader(): boolean {
    return this.checkoutHeaderHost;
  }

  alternarBusca(): void {
    this.buscaAberta.update((aberta) => !aberta);
  }

  atualizarBusca(event: Event): void {
    this.termoBusca.set((event.target as HTMLInputElement).value);
  }

  buscar(event: Event): void {
    event.preventDefault();
    const termo = this.termoBusca().trim();

    this.buscaAberta.set(false);
    void this.router.navigate(['/produtos'], {
      queryParams: { q: termo || null, categoria: null, comodo: null }
    });
  }

  selecionarComodo(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const comodo = select.value;

    if (comodo) {
      void this.router.navigate(['/produtos'], { queryParams: { comodo } });
      select.value = '';
    }
  }
}