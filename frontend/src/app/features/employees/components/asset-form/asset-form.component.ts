import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.css'],
})
export class AssetFormComponent {
  form: FormGroup;
  assetTypes = ['NOTEBOOK', 'MONITOR', 'TECLADO', 'MOUSE'];

  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    public dialogRef: MatDialogRef<AssetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const assetData = {
        ...this.form.value,
        companyId: this.data.companyId,
        employeeId: this.data.employeeId,
      };
      this.assetService.createAssetAndAssociate(assetData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.notificationService.showError(
            err.error.message || 'Erro ao criar o ativo.'
          );
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
