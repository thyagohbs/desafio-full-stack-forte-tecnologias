import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AssetFormComponent } from '../../components/asset-form/asset-form.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
  assets$: Observable<Asset[]>;
  displayedColumns: string[] = ['name', 'type', 'status', 'actions'];

  constructor(
    private assetService: AssetService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
    this.assets$ = this.assetService.assets$;
  }

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.assetService.getAll().subscribe({
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao carregar ativos.';
        this.notificationService.showError(errorMessage);
      },
    });
  }

  openForm(asset?: Asset): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: asset,
    });
  }

  deleteAsset(id: string): void {
    if (confirm('Tem certeza que deseja excluir este ativo?')) {
      this.assetService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Ativo excluído com sucesso.');
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Erro ao excluir o ativo.';
          this.notificationService.showError(errorMessage);
        },
      });
    }
  }

  getStatus(asset: Asset): string {
    return asset.employeeId ? `Associado` : 'Disponível';
  }
}
