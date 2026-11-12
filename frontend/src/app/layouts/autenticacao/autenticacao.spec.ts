import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Autenticacao } from './autenticacao';

describe('Autenticacao', () => {
  let component: Autenticacao;
  let fixture: ComponentFixture<Autenticacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autenticacao],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Autenticacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
