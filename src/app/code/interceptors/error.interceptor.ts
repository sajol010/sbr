import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service'; 

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notify: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {      
        // Network/server unreachable
        if (error.status === 0) {
          this.notify.error('Network error. Please check your internet connection.', 'Connection Failed');
        }

        // Unauthorized - token invalid/expired
        else if (error.status === 401) {
          this.notify.warning('Session expired. Please login again.', 'Unauthorized');
          this.authService.logout();
        }

        // Forbidden - access denied
        else if (error.status === 403) {
          this.notify.error('You do not have permission to access this resource.', 'Access Denied');
        }

        // Not found
        else if (error.status === 404) {
          this.notify.error('The requested resource was not found.', 'Not Found');
        }

        // Internal server error
        else if (error.status === 500) {
          this.notify.error('Something went wrong on the server.', 'Server Error');
        }

        // Other unexpected error
        else {
          const msg = error?.error?.message || 'An unexpected error occurred.';
          this.notify.error(msg, `Error ${error.status}`);
        }

        // Log error (optional)
        console.error('HTTP Error:', error);

        return throwError(() => error);
      })
    );
  }
}