import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { ApiCategory, ApiProduct } from '../../core/api.models';
import { StoreApiService } from '../../core/store-api.service';
import { Produtos } from './produtos';

describe('Produtos', () => {
  let component: Produtos;
  let fixture: ComponentFixture<Produtos>;
  let createPayload: Omit<ApiProduct, 'id' | 'category'> | undefined;
  let updateCall: { id: number; payload: Partial<Omit<ApiProduct, 'id' | 'category'>> } | undefined;

  beforeEach(async () => {
    const category: ApiCategory = {
      id: 7,
      name: 'Quarto',
      description: null,
      status: true
    };
    const savedProduct: ApiProduct = {
      id: 12,
      category_id: category.id,
      category,
      name: 'Produto de teste',
      description: 'Produto de teste',
      price: 25,
      stock: 3,
      image: null,
      status: true
    };
    createPayload = undefined;
    updateCall = undefined;

    await TestBed.configureTestingModule({
      imports: [Produtos],
      providers: [{
        provide: StoreApiService,
        useValue: {
          listAdminProducts: () => of([]),
          listCategories: () => of([category]),
          createProduct: (payload: Omit<ApiProduct, 'id' | 'category'>) => {
            createPayload = payload;
            return of(savedProduct);
          },
          updateProduct: (id: number, payload: Partial<Omit<ApiProduct, 'id' | 'category'>>) => {
            updateCall = { id, payload };
            return of(savedProduct);
          },
          deleteProduct: () => of(undefined)
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(Produtos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends the selected category id when creating a product', () => {
    component.salvarProduto({
      id: 0,
      nome: 'Produto de teste',
      categoria: 'Quarto',
      categoriaId: 7,
      preco: 25,
      estoque: 3,
      status: 'Ativo'
    });

    expect(createPayload?.category_id).toBe(7);
    expect(component.erro()).toBe('');
  });

  it('sends the selected category id when updating a product', () => {
    component.editarProduto({
      id: 12,
      nome: 'Produto de teste',
      categoria: 'Quarto',
      categoriaId: 7,
      preco: 25,
      estoque: 3,
      status: 'Ativo'
    });

    component.salvarProduto({
      id: 12,
      nome: 'Produto atualizado',
      categoria: 'Quarto',
      categoriaId: 7,
      preco: 30,
      estoque: 4,
      status: 'Ativo'
    });

    expect(updateCall?.id).toBe(12);
    expect(updateCall?.payload.category_id).toBe(7);
    expect(component.erro()).toBe('');
  });
});
