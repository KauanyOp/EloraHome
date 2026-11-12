import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Produto } from './produto';

describe('Produto', () => {
  let component: Produto;
  let fixture: ComponentFixture<Produto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Produto],
      providers: [provideRouter([{ path: 'produto/:id', component: Produto }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Produto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
