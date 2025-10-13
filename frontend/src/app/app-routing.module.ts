import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './features/companies/pages/companies/companies.component';
import { EmployeesComponent } from './features/employees/pages/employees/employees.component';
import { EmployeeAssetsComponent } from './features/assets/pages/employee-assets/employee-assets.component';
import { AssetsComponent } from './features/assets/pages/assets/assets.component';

const routes: Routes = [
  { path: '', redirectTo: 'companies', pathMatch: 'full' },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/:id/employees', component: EmployeesComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id/assets', component: EmployeeAssetsComponent },
  { path: 'assets', component: AssetsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
