import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CarrinhoService } from '../../components/carrinho/carrinho.service';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
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
