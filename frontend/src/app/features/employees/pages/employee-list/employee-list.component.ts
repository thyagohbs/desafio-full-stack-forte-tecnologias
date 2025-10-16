import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { Employee } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    AsyncPipe,
    MatDialogModule,
    MatTooltipModule,
  ],
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  displayedColumns: string[] = ['name', 'email', 'company', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.employees$ = this.employeeService.employees$;
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      error: (err) => {
        this.notificationService.showError('Erro ao carregar os funcionários.');
        console.error(err);
      },
    });
  }

  openForm(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { employee: employee },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const operation = employee
          ? this.employeeService.update(employee.id, result)
          : this.employeeService.create(result);

        operation.subscribe({
          next: () => {
            const message = employee
              ? 'Funcionário atualizado com sucesso.'
              : 'Funcionário criado com sucesso.';
            this.notificationService.showSuccess(message);
            this.loadEmployees();
          },
          error: (err) => {
            const errorMessage =
              err.error?.message || 'Ocorreu um erro na operação.';
            this.notificationService.showError(errorMessage);
          },
        });
      }
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Funcionário excluído com sucesso.'
          );
          this.loadEmployees();
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || 'Erro ao excluir o funcionário.';
          this.notificationService.showError(errorMessage);
        },
      });
    }
  }
}
