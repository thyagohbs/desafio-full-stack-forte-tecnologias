import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs/operators';
import { Company } from '../../../../core/models/company.model';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeFormComponent } from '../../../employees/components/employee-form/employee-form.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeAssetListComponent } from '../../../employees/pages/employee-asset-list/employee-asset-list.component';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  employees: Employee[] = [];
  companyId!: string;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap((params) => {
          this.companyId = params.get('id')!;
        }),
        switchMap(() => this.companyService.getById(this.companyId)),
        tap((company) => {
          this.company = company;
        }),
        switchMap(() => this.employeeService.getAll(this.companyId))
      )
      .subscribe({
        next: (employees) => {
          this.employees = employees;
        },
        error: (err) => {
          this.notificationService.showError(
            'Erro ao carregar detalhes da empresa ou funcionários.'
          );
          console.error(err);
        },
      });
  }

  loadEmployees(): void {
    this.employeeService.getAll(this.companyId).subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar funcionários.');
        console.error(err);
      },
    });
  }

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  openEditEmployeeDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { employee, companyId: this.companyId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  openDeleteEmployeeDialog(employeeId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: 'Tem certeza de que deseja excluir este funcionário?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.delete(employeeId).subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Funcionário excluído com sucesso!'
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
    });
  }

  openAssetManagement(employee: Employee): void {
    this.dialog.open(EmployeeAssetListComponent, {
      width: '800px',
      data: { employeeId: employee.id, companyId: this.companyId },
    });
  }
}
