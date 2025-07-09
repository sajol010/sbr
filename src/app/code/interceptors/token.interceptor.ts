import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, filter, switchMap, take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../shared/loader/loader.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get('access_token');
    const tokenType = this.cookieService.get('token_type');

    // Show loader
    this.loaderService.show();

    if (token && tokenType) {
      request = this.addToken(request, tokenType, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  private addToken(request: HttpRequest<any>, type: string, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `${type} ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;

          const newToken = res.data.token;
          const tokenType = res.data.token_type;
          const expiresInSeconds = res.expires_in || 1296000; // fallback if expires_in missing
          const expiryDate = new Date(new Date().getTime() + expiresInSeconds * 1000);

          this.cookieService.set('access_token', newToken, expiryDate, '/');
          this.cookieService.set('token_type', tokenType, expiryDate, '/');

          this.refreshTokenSubject.next(newToken);

          return next.handle(this.addToken(request, tokenType, newToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout(); // Logout and redirect to login
          return throwError(() => err);
        })
      );
    } else {
      // Wait until token is refreshed
      return this.refreshTokenSubject.pipe(
        filter(token => !!token),
        take(1),
        switchMap(token => {
          const tokenType = this.cookieService.get('token_type');
          return next.handle(this.addToken(request, tokenType, token!));
        })
      );
    }
  }
}