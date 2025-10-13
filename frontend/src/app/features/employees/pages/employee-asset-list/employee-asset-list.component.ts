import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { AssetFormComponent } from '../../components/asset-form/asset-form.component';
import { AssociateAssetDialogComponent } from '../../components/associate-asset-dialog/associate-asset-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-asset-list',
  templateUrl: './employee-asset-list.component.html',
  styleUrls: ['./employee-asset-list.component.css'],
})
export class EmployeeAssetListComponent implements OnInit {
  assets: Asset[] = [];
  employeeId!: string;
  companyId!: string;
  displayedColumns: string[] = ['name', 'type', 'description', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;
    this.companyId = this.route.snapshot.queryParamMap.get('companyId')!;
    this.loadAssets();
  }

  loadAssets(): void {
    this.assetService
      .getAssetsByEmployee(this.employeeId)
      .subscribe((assets) => {
        this.assets = assets;
      });
  }

  openCreateAssetDialog(): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: { companyId: this.companyId, employeeId: this.employeeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssets();
        this.notificationService.showSuccess(
          'Novo ativo criado e associado com sucesso!'
        );
      }
    });
  }

  openAssociateAssetDialog(): void {
    const dialogRef = this.dialog.open(AssociateAssetDialogComponent, {
      width: '400px',
      data: { companyId: this.companyId, employeeId: this.employeeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssets();
        this.notificationService.showSuccess('Ativo associado com sucesso!');
      }
    });
  }

  disassociateAsset(assetId: string): void {
    this.assetService
      .disassociateAssetFromEmployee(this.employeeId, assetId)
      .subscribe({
        next: () => {
          this.loadAssets();
          this.notificationService.showSuccess(
            'Ativo desassociado com sucesso!'
          );
        },
        error: () => {
          this.notificationService.showError('Erro ao desassociar o ativo.');
        },
      });
  }
}
