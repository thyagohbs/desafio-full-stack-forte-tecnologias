import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-associate-asset-dialog',
  templateUrl: './associate-asset-dialog.component.html',
  styleUrls: ['./associate-asset-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class AssociateAssetDialogComponent implements OnInit {
  @Output() assetAssociated = new EventEmitter<void>();
  form: FormGroup;
  availableAssets: Asset[] = [];

  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    public dialogRef: MatDialogRef<AssociateAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      assetId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAvailableAssets();
  }

  loadAvailableAssets(): void {
    this.assetService.getAvailableAssets().subscribe((assets) => {
      this.availableAssets = assets;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.assetService
        .associateAsset(this.form.value.assetId, this.data.employeeId)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.notificationService.showError(
              err.error.message || 'Erro ao associar o ativo.'
            );
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
