import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-associate-asset-dialog',
  templateUrl: './associate-asset-dialog.component.html',
  styleUrls: ['./associate-asset-dialog.component.css'],
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
