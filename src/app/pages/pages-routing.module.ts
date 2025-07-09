import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./../pages/services/services.module').then(m => m.ServicesModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./../pages/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'staff', // This will be accessible via /admin/staff
    loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
  },
  {
    path: 'customers', // This will be accessible via /admin/customers
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
