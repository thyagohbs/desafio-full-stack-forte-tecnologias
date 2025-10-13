import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  constructor(private companyService: CompanyService, private router: Router) {}

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
    });
  }

  viewCompanyDetails(companyId: string): void {
    this.router.navigate(['/companies', companyId]);
  }
}
