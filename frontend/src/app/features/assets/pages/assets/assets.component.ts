import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AssetFormComponent } from '../../components/asset-form/asset-form.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  displayedColumns: string[] = ['name', 'tag', 'type', 'status', 'actions'];

  constructor(
    private assetService: AssetService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.assetService.getAll().subscribe({
      next: (data) => {
        this.assets = data;
      },
      error: () =>
        this.notificationService.showError('Erro ao carregar ativos.'),
    });
  }

  openAssetForm(asset?: Asset): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: asset,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssets();
      }
    });
  }

  deleteAsset(asset: Asset): void {
    if (asset.employeeId) {
      this.notificationService.showError(
        'Não é possível excluir um ativo associado a um funcionário.'
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o ativo ${asset.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.assetService.delete(asset.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Ativo excluído com sucesso!');
            this.loadAssets();
          },
          error: () =>
            this.notificationService.showError('Erro ao excluir ativo.'),
        });
      }
    });
  }

  getStatus(asset: Asset): string {
    return asset.employeeId ? `Associado` : 'Disponível';
  }
}
