import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ApiCart, ApiCategory, ApiOrder, ApiProduct, ApiUser } from './api.models';

@Injectable({ providedIn: 'root' })
export class StoreApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  listProducts(): Observable<ApiProduct[]> {
    return this.http.get<ApiProduct[]>(`${this.baseUrl}/products`);
  }

  getProduct(id: number): Observable<ApiProduct> {
    return this.http.get<ApiProduct>(`${this.baseUrl}/products/${id}`);
  }

  listAdminProducts(): Observable<ApiProduct[]> {
    return this.http.get<ApiProduct[]>(`${this.baseUrl}/admin/products`);
  }

  createProduct(product: Omit<ApiProduct, 'id' | 'category'>): Observable<ApiProduct> {
    return this.http.post<ApiProduct>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Omit<ApiProduct, 'id' | 'category'>>): Observable<ApiProduct> {
    return this.http.patch<ApiProduct>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  listCategories(): Observable<ApiCategory[]> {
    return this.http.get<ApiCategory[]>(`${this.baseUrl}/categories`);
  }

  listUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.baseUrl}/users`);
  }

  createUser(user: {
    name: string;
    email: string;
    password: string;
    phone: string;
    is_admin: boolean;
  }): Observable<ApiUser> {
    return this.http.post<ApiUser>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<ApiUser>): Observable<ApiUser> {
    return this.http.patch<ApiUser>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  listOrders(): Observable<ApiOrder[]> {
    return this.http.get<ApiOrder[]>(`${this.baseUrl}/orders`);
  }

  listMyOrders(): Observable<ApiOrder[]> {
    return this.http.get<ApiOrder[]>(`${this.baseUrl}/orders/mine`);
  }

  getCart(): Observable<ApiCart> {
    return this.http.get<ApiCart>(`${this.baseUrl}/cart`);
  }

  addCartItem(item: { product_id: number; quantity: number }): Observable<ApiCart> {
    return this.http.post<ApiCart>(`${this.baseUrl}/cart/items`, item);
  }

  setCartItemQuantity(productId: number, quantity: number): Observable<ApiCart> {
    return this.http.patch<ApiCart>(`${this.baseUrl}/cart/items/${productId}`, { quantity });
  }

  removeCartItem(productId: number): Observable<ApiCart> {
    return this.http.delete<ApiCart>(`${this.baseUrl}/cart/items/${productId}`);
  }

  clearCart(): Observable<ApiCart> {
    return this.http.delete<ApiCart>(`${this.baseUrl}/cart`);
  }

  createOrder(order: {
    items: { product_id: number; quantity: number }[];
    shipping_name: string;
    shipping_email: string;
    shipping_phone: string;
    shipping_cep: string;
    shipping_street: string;
    shipping_number: string;
    shipping_complement: string;
    shipping_neighborhood: string;
    shipping_city: string;
    shipping_state: string;
    payment_method: 'cartao' | 'pix';
  }): Observable<ApiOrder> {
    return this.http.post<ApiOrder>(`${this.baseUrl}/orders`, order);
  }

  updateOrderStatus(id: number, status: ApiOrder['status']): Observable<ApiOrder> {
    return this.http.patch<ApiOrder>(`${this.baseUrl}/orders/${id}`, { status });
  }
}
