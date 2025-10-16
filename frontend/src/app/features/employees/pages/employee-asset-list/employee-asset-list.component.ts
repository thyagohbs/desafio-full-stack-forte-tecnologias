import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Asset } from '../../../../core/models/asset.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AssetFormComponent } from '../../components/asset-form/asset-form.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AssetService } from '../../../../core/services/asset.service';

@Component({
  selector: 'app-employee-asset-list',
  templateUrl: './employee-asset-list.component.html',
  styleUrls: ['./employee-asset-list.component.css'],
})
export class EmployeeAssetListComponent implements OnInit {
  assets: Asset[] = [];
  employeeId: string;
  companyId: string;
  displayedColumns: string[] = ['name', 'type', 'status', 'actions'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { employeeId: string; companyId: string },
    public dialogRef: MatDialogRef<EmployeeAssetListComponent>,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.employeeId = data.employeeId;
    this.companyId = data.companyId;
  }

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.employeeService.getAssetsByEmployee(this.employeeId).subscribe({
      next: (assets) => {
        this.assets = assets;
      },
      error: () => {
        this.notificationService.showError(
          'Erro ao carregar os ativos do funcionário.'
        );
      },
    });
  }

  openAddAssetDialog(): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: {
        employeeId: this.employeeId,
        companyId: this.companyId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssets();
      }
    });
  }

  disassociateAsset(assetId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmar Desassociação',
        message: 'Tem certeza que deseja desassociar este ativo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assetService.disassociateAsset(assetId).subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Ativo desassociado com sucesso!'
            );
            this.loadAssets();
          },
          error: (err) => {
            this.notificationService.showError(
              err.error.message || 'Erro ao desassociar ativo.'
            );
          },
        });
      }
    });
  }
}
