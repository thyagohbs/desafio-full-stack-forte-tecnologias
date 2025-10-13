import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'email', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.companyService.getCompanyById(companyId).subscribe((company) => {
        this.company = company;
      });
      this.employeeService
        .getEmployeesByCompany(companyId)
        .subscribe((employees) => {
          this.employees = employees;
        });
    }
  }

  viewEmployeeAssets(employeeId: string): void {
    this.router.navigate(['/employees', employeeId, 'assets']);
  }
}
