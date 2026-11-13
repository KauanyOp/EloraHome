import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { Confirmacao } from '../../components/confirmacao/confirmacao';
import { AuthService } from '../../core/auth.service';
import { StoreApiService } from '../../core/store-api.service';
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
      ]),
      {
        provide: AuthService,
        useValue: {
          token: signal('test-token'),
          user: signal({ id: 1, name: 'Ana Silva', email: 'ana@example.com', phone: null, birth_date: null, cep: null, street: null, number: null, complement: null, neighborhood: null, city: null, state: null, is_admin: false, is_active: true }),
          currentUser: () => of({ id: 1, name: 'Ana Silva', email: 'ana@example.com', phone: null, birth_date: null, cep: null, street: null, number: null, complement: null, neighborhood: null, city: null, state: null, is_admin: false, is_active: true })
        }
      },
      {
        provide: StoreApiService,
        useValue: {
          getCart: () => of({ id: 1, user_id: 1, items: [], quantity: 0, total: '0.00' }),
          addCartItem: ({ product_id, quantity }: { product_id: number; quantity: number }) => of({
            id: 1,
            user_id: 1,
            items: [{
              id: 1,
              product_id,
              quantity,
              unit_price: '279.00',
              subtotal: `${(279 * quantity).toFixed(2)}`,
              product: {
                id: product_id,
                name: 'Jogo de cama em algodão',
                image: '/jogo-de-cama.jpg'
              }
            }],
            quantity,
            total: `${(279 * quantity).toFixed(2)}`
          }),
          setCartItemQuantity: () => of({ id: 1, user_id: 1, items: [], quantity: 0, total: '0.00' }),
          removeCartItem: () => of({ id: 1, user_id: 1, items: [], quantity: 0, total: '0.00' }),
          clearCart: () => of({ id: 1, user_id: 1, items: [], quantity: 0, total: '0.00' }),
          createOrder: () => of({
            id: 42,
            user_id: 1,
            status: 'pendente',
            total: 558,
            created_at: '2026-11-13T00:00:00.000Z',
            shipping_name: 'Ana Silva',
            shipping_email: 'ana@example.com',
            shipping_phone: '11999999999',
            shipping_cep: '01000-000',
            shipping_street: 'Rua das Flores',
            shipping_number: '10',
            shipping_complement: null,
            shipping_neighborhood: null,
            shipping_city: 'São Paulo',
            shipping_state: 'SP',
            payment_method: 'pix',
            items: [{
              id: 1,
              product_id: 1,
              quantity: 2,
              unit_price: 279,
              subtotal: 558,
              product: {
                id: 1,
                category_id: 1,
                category: { id: 1, name: 'Quarto', description: null, status: true },
                name: 'Jogo de cama em algodão',
                description: 'Cama arrumada',
                price: 279,
                stock: 5,
                image: '/jogo-de-cama.jpg',
                status: true
              }
            }]
          })
        }
      }],
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
    expect(carrinho.itens()).toHaveLength(0);

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
