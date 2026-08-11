import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private lastCheck = 0;
  private readonly CHECK_INTERVAL = 60 * 60 * 1000;

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    params: () => ({}),
    stream: () => this.checkStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() == 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  register(fullName: string, email: string, password: string): Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      fullName: fullName,
      email: email,
      password: password
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  checkStatus():Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token) {
      this.logout();
      return of(false);
    }

    const now = Date.now();

    if (this._authStatus() === 'authenticated' &&
      now - this.lastCheck < this.CHECK_INTERVAL
    ) {
      return of(true);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
    }).pipe(
      map(resp => {
        this.lastCheck = Date.now();
        return this.handleAuthSuccess(resp)
      }),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    this.lastCheck = 0;

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse): boolean{
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError( error: any ): Observable<boolean> {
    this.logout();
    return of(false);
  }

}
