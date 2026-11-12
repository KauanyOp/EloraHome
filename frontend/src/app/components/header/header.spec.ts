import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([{ path: 'produtos', component: Header }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('provides an order-tracking menu shortcut instead of Kits', () => {
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('nav a')) as HTMLAnchorElement[];

    expect(links.some((link) => link.textContent?.includes('Acompanhar pedido'))).toBe(true);
    expect(links.some((link) => link.textContent?.includes('Kits'))).toBe(false);
  });

  it('navigates to product results for the submitted search term', async () => {
    component.termoBusca.set('toalhas');
    component.buscar(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(router.url).toContain('q=toalhas');
    expect(component.buscaAberta()).toBe(false);
  });
});
