import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeFormComponent } from '../../../employees/components/employee-form/employee-form.component';
//import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  //imports: [MatTooltipModule],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  companyId: string | null = null;
  displayedColumns: string[] = ['name', 'email', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    this.loadEmployees();
  }

  loadEmployees(): void {
    if (this.companyId) {
      this.companyService
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
        this.loadEmployees();
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
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(employeeId: string): void {
    if (this.companyId) {
      this.companyService
        .deleteEmployee(this.companyId, employeeId)
        .subscribe(() => {
          this.loadEmployees();
        });
    }
  }
}
