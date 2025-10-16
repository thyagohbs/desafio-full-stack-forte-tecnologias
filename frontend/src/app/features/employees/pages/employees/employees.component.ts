import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  company: Company | null = null;
  companyId: string | null = null;
  displayedColumns: string[] = ['name', 'email', 'cpf', 'position', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.companyId = params.get('companyId');
      this.loadEmployees();
      if (this.companyId) {
        this.loadCompanyDetails();
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll(this.companyId ?? undefined).subscribe({
      next: (data) => (this.employees = data),
      error: (err) =>
        this.notificationService.showError('Erro ao carregar os funcionários.'),
    });
  }

  loadCompanyDetails(): void {
    if (!this.companyId) return;
    this.companyService.getById(this.companyId).subscribe({
      next: (data) => (this.company = data),
      error: (err) =>
        this.notificationService.showError(
          'Erro ao carregar detalhes da empresa.'
        ),
    });
  }

  viewAssets(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'assets']);
  }

  openEmployeeForm(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { employee: employee, companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const message = employee
          ? 'Funcionário atualizado com sucesso.'
          : 'Funcionário criado com sucesso.';
        this.notificationService.showSuccess(message);
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o funcionário ${employee.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.employeeService.delete(employee.id).subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Funcionário excluído com sucesso!'
            );
            this.loadEmployees();
          },
          error: () =>
            this.notificationService.showError('Erro ao excluir funcionário.'),
        });
      }
    });
  }
}
