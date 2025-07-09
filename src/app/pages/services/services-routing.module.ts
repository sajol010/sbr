import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesListComponent } from './services-list/services-list.component';

const routes: Routes = [
  { path: '', component: ServicesListComponent } // default route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {}
