import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Company } from '../../../../core/models/company.model';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeFormComponent } from '../../../employees/components/employee-form/employee-form.component';
import { EmployeeListComponent } from '../employee-list/employee-list.component';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    EmployeeListComponent,
  ],
})
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  employees: Employee[] = [];
  companyId!: string;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id')!;
    this.loadCompanyDetails();
    this.loadEmployees();
  }

  loadCompanyDetails(): void {
    this.companyService.getById(this.companyId).subscribe((company) => {
      this.company = company;
    });
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployeesByCompany(this.companyId)
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  openAddEmployeeDialog(): void {
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

  openEditEmployeeDialog(employee: Employee): void {
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

  openDeleteEmployeeDialog(employeeId: string): void {
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
