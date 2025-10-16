import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { AssetService } from '../../../../core/services/asset.service';
import { Employee } from '../../../../core/models/employee.model';
import { Asset } from '../../../../core/models/asset.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AssociateAssetDialogComponent } from '../../../employees/components/associate-asset-dialog/associate-asset-dialog.component';

@Component({
  selector: 'app-employee-assets',
  templateUrl: './employee-assets.component.html',
  styleUrls: ['./employee-assets.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    AssociateAssetDialogComponent,
  ],
})
export class EmployeeAssetsComponent implements OnInit {
  employee: Employee | null = null;
  associatedAssets: Asset[] = [];
  employeeId!: string;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('employeeId');
          if (!id) {
            this.notificationService.showError(
              'ID do funcionário não encontrado.'
            );
            return of([null, []] as [Employee | null, Asset[]]);
          }
          this.employeeId = id;
          return forkJoin([
            this.employeeService.getById(this.employeeId),
            this.assetService.getAssetsByEmployee(this.employeeId),
          ]);
        }),
        catchError(() => {
          this.notificationService.showError(
            'Erro ao carregar dados do funcionário e ativos.'
          );
          return of([null, []] as [Employee | null, Asset[]]);
        })
      )
      .subscribe(([employee, assets]) => {
        this.employee = employee;
        this.associatedAssets = assets;
      });
  }

  loadAssociatedAssets(): void {
    this.assetService
      .getAssetsByEmployee(this.employeeId)
      .pipe(
        catchError(() => {
          this.notificationService.showError('Erro ao recarregar ativos.');
          return of([]);
        })
      )
      .subscribe((assets) => {
        this.associatedAssets = assets;
      });
  }

  openAssociateAssetDialog(): void {
    const dialogRef = this.dialog.open(AssociateAssetDialogComponent, {
      width: '500px',
      data: { employeeId: this.employeeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssociatedAssets();
      }
    });
  }

  dissociateAsset(assetId: string): void {
    if (confirm('Tem certeza que deseja desassociar este ativo?')) {
      this.assetService.disassociateAsset(assetId).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Ativo desassociado com sucesso!'
          );
          this.loadAssociatedAssets();
        },
        error: (err) => {
          this.notificationService.showError(
            err.error.message || 'Erro ao desassociar o ativo.'
          );
        },
      });
    }
  }
}
