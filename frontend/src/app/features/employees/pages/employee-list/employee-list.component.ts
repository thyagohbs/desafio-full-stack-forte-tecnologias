import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Employee } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'email', 'position', 'actions'];
  companyId = '1';

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployeesByCompany(this.companyId)
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  openEmployeeForm(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { employee, companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
        this.notificationService.showSuccess(
          `Funcionário ${employee ? 'atualizado' : 'criado'} com sucesso!`
        );
      }
    });
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
        this.notificationService.showSuccess(
          'Funcionário excluído com sucesso!'
        );
      },
      error: () => {
        this.notificationService.showError('Erro ao excluir o funcionário.');
      },
    });
  }

  viewAssets(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'assets'], {
      queryParams: { companyId: this.companyId },
    });
  }
}
