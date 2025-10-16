import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/company.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns: string[] = ['name', 'cnpj', 'address', 'actions'];

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar as empresas.');
        console.error(err);
      },
    });
  }

  openCompanyForm(company?: Company): void {
    const dialogRef = this.dialog.open(CompanyFormComponent, {
      width: '400px',
      data: company,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (company) {
          // Edit mode
          this.companyService.update(company.id, result).subscribe({
            next: () => {
              this.loadCompanies();
              this.notificationService.showSuccess(
                'Empresa atualizada com sucesso!'
              );
            },
            error: (err) =>
              this.notificationService.showError(
                err.error.message || 'Erro ao atualizar a empresa.'
              ),
          });
        } else {
          // Create mode
          this.companyService.create(result).subscribe({
            next: () => {
              this.loadCompanies();
              this.notificationService.showSuccess(
                'Empresa criada com sucesso!'
              );
            },
            error: (err) =>
              this.notificationService.showError(
                err.error.message || 'Erro ao criar a empresa.'
              ),
          });
        }
      }
    });
  }

  deleteCompany(id: string): void {
    this.companyService.delete(id).subscribe({
      next: () => {
        this.loadCompanies();
        this.notificationService.showSuccess('Empresa excluída com sucesso!');
      },
      error: (err) => {
        this.notificationService.showError(
          err.error.message || 'Erro ao excluir a empresa.'
        );
      },
    });
  }

  viewEmployees(company: Company): void {
    this.router.navigate(['/employees'], {
      queryParams: { companyId: company.id },
    });
  }
}
