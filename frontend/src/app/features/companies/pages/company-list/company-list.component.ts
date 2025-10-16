import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/company.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class CompanyListComponent implements OnInit {
  companies$: Observable<Company[]>;
  displayedColumns: string[] = ['id', 'name', 'cnpj', 'actions'];
  searchControl = new FormControl('');

  constructor(
    private companyService: CompanyService,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.companies$ = this.companyService.getAll();
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companies$ = this.companyService.getAll().pipe(
      catchError(() => {
        this.notificationService.showError(
          'Erro ao carregar a lista de empresas.'
        );
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
        if (this.searchControl.value) {
          this.searchById();
        } else {
          this.loadCompanies();
        }
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
}
