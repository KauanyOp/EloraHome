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
});
