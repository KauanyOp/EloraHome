import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { StoreApiService } from './store-api.service';

describe('StoreApiService', () => {
  let api: StoreApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            token: signal('test-token'),
            clearSession: () => {}
          }
        }
      ]
    });
    api = TestBed.inject(StoreApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('fetches the public catalog from the configured API URL', () => {
    api.listProducts().subscribe();

    const request = http.expectOne(`${environment.apiUrl}/products`);
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('sends authenticated requests with a bearer token', () => {
    api.listOrders().subscribe();

    const request = http.expectOne(`${environment.apiUrl}/orders`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush([]);
  });

  it('uses the cart API for persisted cart operations', () => {
    api.getCart().subscribe();
    const readRequest = http.expectOne(`${environment.apiUrl}/cart`);
    expect(readRequest.request.method).toBe('GET');
    readRequest.flush({ id: 1, user_id: 2, items: [], quantity: 0, total: '0.00' });

    api.addCartItem({ product_id: 4, quantity: 2 }).subscribe();
    const addRequest = http.expectOne(`${environment.apiUrl}/cart/items`);
    expect(addRequest.request.method).toBe('POST');
    expect(addRequest.request.body).toEqual({ product_id: 4, quantity: 2 });
    addRequest.flush({ id: 1, user_id: 2, items: [], quantity: 0, total: '0.00' });

    api.setCartItemQuantity(4, 3).subscribe();
    const updateRequest = http.expectOne(`${environment.apiUrl}/cart/items/4`);
    expect(updateRequest.request.method).toBe('PATCH');
    expect(updateRequest.request.body).toEqual({ quantity: 3 });
    updateRequest.flush({ id: 1, user_id: 2, items: [], quantity: 0, total: '0.00' });

    api.removeCartItem(4).subscribe();
    const removeRequest = http.expectOne(`${environment.apiUrl}/cart/items/4`);
    expect(removeRequest.request.method).toBe('DELETE');
    removeRequest.flush({ id: 1, user_id: 2, items: [], quantity: 0, total: '0.00' });

    api.clearCart().subscribe();
    const clearRequest = http.expectOne(`${environment.apiUrl}/cart`);
    expect(clearRequest.request.method).toBe('DELETE');
    clearRequest.flush({ id: 1, user_id: 2, items: [], quantity: 0, total: '0.00' });
  });
});
