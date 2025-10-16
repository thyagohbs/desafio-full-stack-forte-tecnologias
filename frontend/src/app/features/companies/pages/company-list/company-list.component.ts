import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/company.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class CompanyListComponent implements OnInit {
  companies$!: Observable<Company[]>;
  displayedColumns: string[] = ['id', 'name', 'cnpj', 'actions'];
  searchControl = new FormControl('');

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
    this.companies$ = this.companyService.getAll().pipe(
      catchError(() => {
        this.notificationService.showError('Erro ao carregar as empresas.');
        return of([]);
      })
    );
  }

  searchById(): void {
    const searchTerm = this.searchControl.value?.trim();
    if (!searchTerm) {
      this.loadCompanies();
      return;
    }

    this.companies$ = this.companyService.getAll().pipe(
      map((companies) =>
        companies.filter((company) => company.id.startsWith(searchTerm))
      ),
      catchError(() => {
        this.notificationService.showError('Erro ao buscar empresas.');
        return of([]);
      })
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.loadCompanies();
  }

  openDialog(company?: Company): void {
    const dialogRef = this.dialog.open(CompanyFormComponent, {
      width: '400px',
      data: { company },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  deleteCompany(id: string): void {
    if (confirm('Tem certeza que deseja remover esta empresa?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Empresa removida com sucesso!');
          this.loadCompanies();
        },
        error: () => {
          this.notificationService.showError('Erro ao remover a empresa.');
        },
      });
    }
  }

  viewCompanyDetails(company: Company): void {
    this.router.navigate(['/companies', company.id, 'employees']);
  }
}
