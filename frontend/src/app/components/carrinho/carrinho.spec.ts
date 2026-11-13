import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { StoreApiService } from '../../core/store-api.service';
import { Carrinho } from './carrinho';

describe('Carrinho', () => {
  let component: Carrinho;
  let fixture: ComponentFixture<Carrinho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carrinho],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { user: signal(null), token: signal(null) }
        },
        {
          provide: StoreApiService,
          useValue: {
            getCart: () => of({ id: 1, user_id: 1, items: [], quantity: 0, total: '0.00' })
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Carrinho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
