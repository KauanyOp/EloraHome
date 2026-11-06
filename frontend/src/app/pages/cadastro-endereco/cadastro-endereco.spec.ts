import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroEndereco } from './cadastro-endereco';

describe('CadastroEndereco', () => {
  let component: CadastroEndereco;
  let fixture: ComponentFixture<CadastroEndereco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEndereco],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroEndereco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
