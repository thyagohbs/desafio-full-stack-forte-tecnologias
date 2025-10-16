import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetFormComponent } from '../../components/asset-form/asset-form.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class AssetsComponent implements OnInit {
  assets$!: Observable<Asset[]>;
  displayedColumns: string[] = ['id', 'name', 'type', 'status', 'actions'];
  searchControl = new FormControl('');

  constructor(
    private assetService: AssetService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.assets$ = this.assetService.getAll().pipe(
      catchError(() => {
        this.notificationService.showError('Erro ao carregar os ativos.');
        return of([]);
      })
    );
  }

  searchById(): void {
    const searchTerm = this.searchControl.value?.trim();
    if (!searchTerm) {
      this.loadAssets();
      return;
    }

    this.assets$ = this.assetService.getAll().pipe(
      map((assets) =>
        assets.filter((asset) => asset.id.startsWith(searchTerm))
      ),
      catchError(() => {
        this.notificationService.showError('Erro ao buscar ativos.');
        return of([]);
      })
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.loadAssets();
  }

  openAssetForm(asset?: Asset): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: { asset },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssets();
      }
    });
  }

  deleteAsset(id: string): void {
    if (confirm('Tem certeza que deseja remover este ativo?')) {
      this.assetService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Ativo removido com sucesso!');
          this.loadAssets();
        },
        error: () => {
          this.notificationService.showError('Erro ao remover o ativo.');
        },
      });
    }
  }
}
