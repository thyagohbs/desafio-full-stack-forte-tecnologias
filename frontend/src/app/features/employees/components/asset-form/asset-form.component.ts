import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetService } from '../../../../core/services/asset.service';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.css'],
})
export class AssetFormComponent implements OnInit {
  assetForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AssetFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { companyId: string; employeeId: string },
    private fb: FormBuilder,
    private assetService: AssetService
  ) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.assetForm.valid) {
      const assetData = {
        ...this.assetForm.value,
        companyId: this.data.companyId,
      };
      this.assetService.createAsset(assetData).subscribe((newAsset) => {
        this.assetService
          .associateAssetToEmployee(this.data.employeeId, newAsset.id)
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      });
    }
  }
}
