import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { catalogoProdutos } from './catalogo';
import { Produtos } from './produtos';

describe('Produtos', () => {
  let component: Produtos;
  let fixture: ComponentFixture<Produtos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Produtos],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Produtos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the room banners out of the product catalog and includes the new products', () => {
    expect(catalogoProdutos).toHaveLength(12);
    expect(catalogoProdutos.some((produto) => produto.nome === 'Sala decorada' || produto.nome === 'Quarto decorado')).toBe(false);
    expect(catalogoProdutos.some((produto) => produto.imagem === '/img/produtos/Espelho-banheiro.jpg')).toBe(true);
    expect(catalogoProdutos.some((produto) => produto.imagem === '/img/produtos/Quadro-decorativos.jpg')).toBe(true);
  });

  it('does not show the removed bedding category filter', () => {
    expect(component.filtros.some((filtro) => filtro.valor === 'cama')).toBe(false);
  });

  it('searches product names and categories without case or accent sensitivity', () => {
    component.busca.set('XICARAS');
    expect(component.produtosFiltrados.map((produto) => produto.nome)).toEqual(['Jogo de xícaras']);

    component.busca.set('BANHEIRO');
    expect(component.produtosFiltrados.length).toBeGreaterThan(0);
    expect(component.produtosFiltrados.every((produto) =>
      produto.categoria === 'banheiro' || produto.comodos.includes('banheiro')
    )).toBe(true);
  });
});
