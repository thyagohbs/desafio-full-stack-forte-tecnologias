import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../core/services/asset.service';
import { Observable } from 'rxjs';
import { Asset } from '../../../../core/models/asset.model';
import { AssetFormComponent } from '../../components/asset-form/asset-form.component';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    AsyncPipe,
    MatDialogModule,
  ],
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

  openAssetForm(asset?: Asset): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: { asset: asset },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssets();
      }
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
