import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

// Third party package
import { NgxLoadingModule } from "ngx-loading";

import { AppComponent } from './app.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { PagesModule } from './pages/pages.module';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { CoreModule } from './code/code.module';
// BookingsModule will be lazy loaded, so remove import from here
// CustomerModule will be lazy loaded, so remove import from here
// StaffModule will be lazy loaded, so remove import from here

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent    
  ],
  imports: [
    BrowserModule,
    NgxLoadingModule.forRoot({}),
    AppRoutingModule,
    CoreModule,
    AdminLayoutModule,
    PagesModule
    // BookingsModule removed for lazy loading
    // CustomerModule removed for lazy loading
    // StaffModule removed for lazy loading
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
