import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminLayoutModule { }
