import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { StaffEditComponent } from './staff-edit/staff-edit.component';
// Consider adding a StaffLayoutComponent if you want a common wrapper for these routes
// import { StaffLayoutComponent } from './staff-layout/staff-layout.component';

const routes: Routes = [
  // If using a StaffLayoutComponent as a wrapper:
  // {
  //   path: '',
  //   component: StaffLayoutComponent, // This component would have its own <router-outlet>
  //   children: [
  //     { path: '', component: StaffListComponent },
  //     { path: 'add', component: StaffAddComponent },
  //     { path: 'edit/:id', component: StaffEditComponent },
  //   ]
  // },
  // Without a specific layout component for staff, routes are direct:
  { path: '', component: StaffListComponent },
  { path: 'add', component: StaffAddComponent },
  { path: 'edit/:id', component: StaffEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
