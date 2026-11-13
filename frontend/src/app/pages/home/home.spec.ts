import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { AuthService } from '../../core/auth.service';
import { StoreApiService } from '../../core/store-api.service';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { user: signal(null), token: signal(null) }
        },
        {
          provide: StoreApiService,
          useValue: {
            listProducts: () => of([{
              id: 1,
              category_id: 1,
              category: { id: 1, name: 'Quarto', description: null, status: true },
              name: 'Jogo de cama em algodão',
              description: 'Cama arrumada',
              price: 279,
              stock: 5,
              image: '/jogo-de-cama.jpg',
              status: true
            }])
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a featured product to the cart', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.adicionar-produto') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();

    const carrinho = TestBed.inject(CarrinhoService);
    expect(carrinho.itens()[0].id).toBe(component.destaques[0].id);
    expect(carrinho.aberto()).toBe(true);
  });
});
