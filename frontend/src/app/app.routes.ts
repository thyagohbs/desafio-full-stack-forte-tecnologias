import { Routes } from '@angular/router';
import { CompanyListComponent } from './features/companies/pages/company-list/company-list.component';
import { CompanyDetailComponent } from './features/companies/pages/company-detail/company-detail.component';
import { AssetsComponent } from './features/assets/pages/assets/assets.component';
import { EmployeeAssetsComponent } from './features/assets/pages/employee-assets/employee-assets.component';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompanyListComponent },
  { path: 'companies/:id/employees', component: CompanyDetailComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'employees/:employeeId/assets', component: EmployeeAssetsComponent },
];
