import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { Confirmacao } from '../../components/confirmacao/confirmacao';
import { PedidoService } from '../pedido/pedido.service';
import { Checkout } from './checkout';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
  let carrinho: CarrinhoService;
  let pedido: PedidoService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [provideRouter([
        { path: 'pedido', component: Confirmacao },
        { path: 'produtos', component: Confirmacao }
      ])],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    carrinho = TestBed.inject(CarrinhoService);
    pedido = TestBed.inject(PedidoService);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates an order and shows confirmation over checkout without navigating away', async () => {
    carrinho.adicionar({
      id: 1,
      nome: 'Jogo de cama em algodão',
      preco: 279,
      imagem: '/jogo-de-cama.jpg'
    }, 2);

    Object.assign(component.dados, {
      nome: 'Ana Silva',
      email: 'ana@example.com',
      telefone: '11999999999',
      cep: '01000-000',
      endereco: 'Rua das Flores',
      numero: '10',
      complemento: '',
      cidade: 'São Paulo',
      estado: 'SP'
    });

    await component.confirmarCompra();

    expect(router.url).not.toBe('/confirmacao');
    expect(component.confirmacaoAberta()).toBe(true);
    expect(pedido.atual()?.total).toBe(558);
    expect(pedido.atual()?.itens).toHaveLength(1);
    expect(carrinho.itens()).toHaveLength(1);

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('clears the cart and opens tracking when the customer chooses to follow the order', async () => {
    carrinho.adicionar({
      id: 1,
      nome: 'Jogo de cama em algodão',
      preco: 279,
      imagem: '/jogo-de-cama.jpg'
    });

    await component.confirmarCompra();
    fixture.detectChanges();

    const acompanhar = fixture.nativeElement.querySelector('.botao-acompanhar') as HTMLAnchorElement;
    acompanhar.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(router.url).toBe('/pedido');
    expect(carrinho.itens()).toEqual([]);
  });

  it('shows the reference checkout fields, payment options, and cart summary', () => {
    carrinho.adicionar({
      id: 1,
      nome: 'Jogo de cama em algodão',
      preco: 279,
      imagem: '/jogo-de-cama.jpg'
    });

    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelector('input[name="nascimento"]')).toBeTruthy();
    expect(elemento.querySelector('input[placeholder^="Ex: 0000"]')).toBeTruthy();
    expect(elemento.querySelector('input[placeholder="Ex: 222"]')).toBeTruthy();
    expect(elemento.querySelector('.resumo-checkout')).toBeTruthy();
    expect(elemento.querySelector('.botao-confirmar')?.textContent).toContain('Confirmar pedido');
  });
});
