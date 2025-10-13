import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'companies',
    loadChildren: () =>
      import('./features/companies/companies.module').then(
        (m) => m.CompaniesModule
      ),
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employees/employees.module').then(
        (m) => m.EmployeesModule
      ),
  },
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
