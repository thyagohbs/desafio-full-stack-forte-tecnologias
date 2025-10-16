import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeFormComponent } from '../../../employees/components/employee-form/employee-form.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  companyId: string | null = null;
  displayedColumns: string[] = ['name', 'email', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.companyId = params.get('id');
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    if (this.companyId) {
      this.employeeService
        .getEmployeesByCompany(this.companyId)
        .subscribe((employees) => {
          this.employees = employees;
        });
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService
          .create({ ...result, companyId: this.companyId })
          .subscribe(() => {
            this.notificationService.showSuccess(
              'Funcionário criado com sucesso.'
            );
            this.loadEmployees();
          });
      }
    });
  }

  openEditDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { employee, companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.update(employee.id, result).subscribe(() => {
          this.notificationService.showSuccess(
            'Funcionário atualizado com sucesso.'
          );
          this.loadEmployees();
        });
      }
    });
  }

  deleteEmployee(employeeId: string): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.delete(employeeId).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Funcionário excluído com sucesso.'
          );
          this.loadEmployees();
        },
        error: (err) => {
          this.notificationService.showError(
            err.error.message || 'Erro ao excluir funcionário.'
          );
        },
      });
    }
  }
}
