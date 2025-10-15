import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/company.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  companies$: Observable<Company[]>;
  displayedColumns: string[] = ['name', 'cnpj', 'actions'];

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.companies$ = this.companyService.companies$;
  }

  ngOnInit(): void {
    this.companyService.getAll().subscribe({
      error: (err) => {
        this.notificationService.showError('Erro ao carregar as empresas.');
        console.error(err);
      },
    });
  }

  openForm(company?: Company): void {
    const dialogRef = this.dialog.open(CompanyFormComponent, {
      width: '400px',
      data: company,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const message = company
          ? 'Empresa atualizada com sucesso.'
          : 'Empresa criada com sucesso.';
        this.notificationService.showSuccess(message);
      }
    });
  }

  deleteCompany(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Empresa excluída com sucesso.');
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || 'Erro ao excluir a empresa.';
          this.notificationService.showError(errorMessage);
        },
      });
    }
  }
}
