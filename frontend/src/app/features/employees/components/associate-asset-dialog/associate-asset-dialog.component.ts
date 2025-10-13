import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';

@Component({
  selector: 'app-associate-asset-dialog',
  templateUrl: './associate-asset-dialog.component.html',
  styleUrls: ['./associate-asset-dialog.component.css'],
})
export class AssociateAssetDialogComponent implements OnInit {
  associateForm: FormGroup;
  availableAssets: Asset[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssociateAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { companyId: string; employeeId: string },
    private fb: FormBuilder,
    private assetService: AssetService
  ) {
    this.associateForm = this.fb.group({
      assetId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAvailableAssets();
  }

  loadAvailableAssets(): void {
    this.assetService
      .getUnassociatedAssets(this.data.companyId)
      .subscribe((assets) => {
        this.availableAssets = assets;
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.associateForm.valid) {
      const assetId = this.associateForm.value.assetId;
      this.assetService
        .associateAssetToEmployee(this.data.employeeId, assetId)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }
}
