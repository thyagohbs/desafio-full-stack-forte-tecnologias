import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeAssetListComponent } from './pages/employee-asset-list/employee-asset-list.component';
import { AssociateAssetDialogComponent } from './components/associate-asset-dialog/associate-asset-dialog.component';
import { AssetFormComponent } from './components/asset-form/asset-form.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeAssetListComponent,
    AssociateAssetDialogComponent,
    AssetFormComponent,
    EmployeeFormComponent,
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    RouterModule,
  ],
})
export class EmployeesModule {}
