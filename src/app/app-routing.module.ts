import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children:[
      {
        path: '',
        loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  //Wildcard Route
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
