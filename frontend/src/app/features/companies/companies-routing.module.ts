import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyListComponent,
  },
  {
    path: ':id',
    component: CompanyDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
