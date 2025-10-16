import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { Company } from '../../../../core/models/company.model';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeService } from '../../../../core/services/employee.service';

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
    MatToolbarModule,
    MatTableModule,
  ],
})
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  employees: Employee[] = [];
  companyId!: string;
  displayedColumns: string[] = ['name', 'email', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id')!;
    this.loadCompanyDetails();
    this.loadEmployees();
  }

  loadCompanyDetails(): void {
    this.companyService
      .getById(this.companyId)
      .subscribe((company) => (this.company = company));
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployeesByCompany(this.companyId)
      .subscribe((employees) => (this.employees = employees));
  }

  viewEmployeeAssets(employeeId: string): void {
    this.router.navigate(['/employees', employeeId, 'assets']);
  }
}
