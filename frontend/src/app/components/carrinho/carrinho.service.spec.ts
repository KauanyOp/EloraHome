import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { ApiCart, ApiUser } from '../../core/api.models';
import { AuthService } from '../../core/auth.service';
import { StoreApiService } from '../../core/store-api.service';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  it('merges visitor items into the authenticated cart and persists quantity changes', async () => {
    const user = signal<ApiUser | null>(null);
    const token = signal<string | null>(null);
    const productId = 12;
    const createdQuantities: number[] = [];
    const updatedQuantities: number[] = [];

    const emptyCart: ApiCart = {
      id: 1,
      user_id: 7,
      items: [],
      quantity: 0,
      total: '0.00',
    };
    const cartWithQuantity = (quantity: number): ApiCart => ({
      id: 1,
      user_id: 7,
      items: [{
        id: 1,
        product_id: productId,
        quantity,
        unit_price: '12.50',
        subtotal: (12.5 * quantity).toFixed(2),
        product: { id: productId, name: 'Almofada', image: '/almofada.jpg' },
      }],
      quantity,
      total: (12.5 * quantity).toFixed(2),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { user, token } },
        {
          provide: StoreApiService,
          useValue: {
            getCart: () => of(emptyCart),
            addCartItem: ({ quantity }: { product_id: number; quantity: number }) => {
              createdQuantities.push(quantity);
              return of(cartWithQuantity(quantity));
            },
            setCartItemQuantity: (_id: number, quantity: number) => {
              updatedQuantities.push(quantity);
              return of(cartWithQuantity(quantity));
            },
          },
        },
      ],
    });

    const cart = TestBed.inject(CarrinhoService);
    cart.adicionar({
      id: productId,
      nome: 'Almofada',
      preco: 12.5,
      imagem: '/almofada.jpg',
    }, 2);

    expect(cart.itens()[0].quantidade).toBe(2);
    expect(createdQuantities).toEqual([]);

    token.set('test-token');
    user.set({
      id: 7,
      name: 'Ana',
      email: 'ana@example.com',
      phone: null,
      birth_date: null,
      cep: null,
      street: null,
      number: null,
      complement: null,
      neighborhood: null,
      city: null,
      state: null,
      is_admin: false,
      is_active: true,
    });
    await cart.sincronizar();

    expect(createdQuantities).toEqual([2]);
    expect(cart.total()).toBe(25);
    expect(cart.itens()[0].imagem).toBe('/almofada.jpg');

    cart.atualizarQuantidade(productId, 3);
    await cart.sincronizar();

    expect(updatedQuantities).toEqual([3]);
    expect(cart.itens()[0].quantidade).toBe(3);
    expect(cart.total()).toBe(37.5);
  });
});
