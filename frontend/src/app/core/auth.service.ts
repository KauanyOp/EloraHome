import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ApiUser, AuthResponse } from './api.models';

export interface CadastroPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  birth_date: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly tokenKey = 'elora_api_token';
  readonly token = signal(this.readToken());
  readonly user = signal<ApiUser | null>(null);
  readonly isAdmin = computed(() => this.user()?.is_admin === true);
  readonly sessionError = signal('');
  cadastroPendente: CadastroPayload | null = null;

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(tap((response) => this.setSession(response)));
  }

  register(payload: CadastroPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload)
      .pipe(tap((response) => this.setSession(response)));
  }

  restoreSession(): void {
    this.currentUser().subscribe({
      error: () => this.sessionError.set('Não foi possível validar sua sessão. Verifique a conexão com o servidor.')
    });
  }

  currentUser(): Observable<ApiUser | null> {
    const user = this.user();
    if (user) {
      return of(user);
    }
    if (!this.token()) {
      return of(null);
    }

    return this.http.get<ApiUser>(`${this.baseUrl}/auth/me`).pipe(
      tap((current) => this.user.set(current)),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && (
          error.status === 401 ||
          (error.status === 403 && error.error?.message === 'Esta conta está desativada.')
        )) {
          this.clearSession();
          return of(null);
        }
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  clearSession(): void {
    this.token.set(null);
    this.user.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private setSession(response: AuthResponse): void {
    this.token.set(response.token);
    this.user.set(response.user);
    this.sessionError.set('');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, response.token);
    }
  }

  private readToken(): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(this.tokenKey);
  }
}
