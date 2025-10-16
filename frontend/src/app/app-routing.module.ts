import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './features/companies/pages/company-list/company-list.component';
import { CompanyDetailComponent } from './features/companies/pages/company-detail/company-detail.component';
import { EmployeeListComponent } from './features/employees/pages/employee-list/employee-list.component';
import { AssetsComponent } from './features/assets/pages/assets/assets.component';

const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompanyListComponent },
  { path: 'companies/:id', component: CompanyDetailComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'assets', component: AssetsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
