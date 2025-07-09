import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // default value

  constructor(
     private api: ApiService 
    , private router: Router
    , private cookieService: CookieService
    ) {
      // Now safe to use this.cookieService
      this.isLoggedInSubject.next(this.isLoggedIn());
    }

  
  login(credentials: any): Observable<any> {
    return this.api.post('auth/login', credentials);
  }

  register(data: any): Observable<any> {
    return this.api.post('auth/register', data);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.cookieService.get('refresh_token');
    return this.api.post('/auth/refresh', { refresh_token: refreshToken });
  }

  resetPassword(data: any): Observable<any> {
    return this.api.post('/auth/reset-password', data);
  }


  loginSuccess(response: any) {
    const token = response.data.token;
    const refreshToken = response.data.refresh_token;
    const tokenType = response.data.token_type;
    const user = response.data.user;
    const expiresIn = response.data.expires_in;

    const now = new Date();
    const expiryDate = new Date(now.getTime() + expiresIn * 1000);

    const cookieOptions = {
      expires: expiryDate,
      path: '/'  //Make cookie available in all routes
    };

    this.cookieService.set('access_token', token, cookieOptions);
    this.cookieService.set('refresh_token', refreshToken, cookieOptions);
    this.cookieService.set('token_type', tokenType, cookieOptions);
    this.cookieService.set('user', JSON.stringify(user), cookieOptions);

    if (this.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      console.warn('Login success but token missing');
    }
  }


  getToken(): string {
    return this.cookieService.get('access_token');
  }

  getTokenType(): string {
    return this.cookieService.get('token_type');
  }

  getUser(): any {
    let user = this.cookieService.get('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    const path = '/';

    this.cookieService.delete('access_token', path);
    this.cookieService.delete('refresh_token', path);
    this.cookieService.delete('token_type', path);
    this.cookieService.delete('user', path);

    this.isLoggedInSubject.next(false);
    this.router.navigate(['auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('access_token');
  }

  // isLoggedIn(): Observable<boolean> {
  //   return this.isLoggedInSubject.asObservable();
  // }

}