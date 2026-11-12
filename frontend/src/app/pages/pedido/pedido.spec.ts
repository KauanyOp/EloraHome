import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Pedido } from './pedido';

describe('Pedido', () => {
  let component: Pedido;
  let fixture: ComponentFixture<Pedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pedido],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Pedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
