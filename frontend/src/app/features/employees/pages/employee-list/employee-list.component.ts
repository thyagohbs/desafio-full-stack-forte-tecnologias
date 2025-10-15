import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Employee } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
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
      data: employee,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const message = employee
          ? 'Funcionário atualizado com sucesso.'
          : 'Funcionário criado com sucesso.';
        this.notificationService.showSuccess(message);
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
