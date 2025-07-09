import { NgModule, Optional, SkipSelf, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// Third party package
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
// Our own staf
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule.');
    }
  }
}