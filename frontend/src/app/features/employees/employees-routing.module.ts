import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAssetListComponent } from './pages/employee-asset-list/employee-asset-list.component';
import { EmployeesComponent } from './pages/employees/employees.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
  },
  {
    path: 'company/:companyId',
    component: EmployeesComponent,
  },
  {
    path: ':id/assets',
    component: EmployeeAssetListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
