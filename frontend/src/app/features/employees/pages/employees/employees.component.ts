import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from '../../../../core/models/employee.model';
import { Company } from '../../../../core/models/company.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { CompanyService } from '../../../../core/services/company.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

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
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.companyId = params.get('companyId');
          if (this.companyId) {
            this.loadCompanyDetails(this.companyId);
            return this.employeeService.getEmployeesByCompany(this.companyId);
          }
          return this.employeeService.getAll();
        }),
        catchError(() => {
          this.notificationService.showError('Erro ao carregar funcionários.');
          return of([]);
        })
      )
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  loadCompanyDetails(companyId: string): void {
    this.companyService.getById(companyId).subscribe((company) => {
      this.company = company;
    });
  }

  loadEmployees(): void {
    const source$ = this.companyId
      ? this.employeeService.getEmployeesByCompany(this.companyId)
      : this.employeeService.getAll();

    source$
      .pipe(
        catchError(() => {
          this.notificationService.showError(
            'Erro ao recarregar funcionários.'
          );
          return of([]);
        })
      )
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  openEmployeeForm(employee?: Employee): void {
    if (!this.companyId) return;

    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '450px',
      data: { employee, companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Tem certeza que deseja remover ${employee.name}?`)) {
      this.employeeService.delete(employee.id).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Funcionário removido com sucesso!'
          );
          this.loadEmployees();
        },
        error: () => {
          this.notificationService.showError('Erro ao remover funcionário.');
        },
      });
    }
  }

  viewAssets(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'assets']);
  }
}
