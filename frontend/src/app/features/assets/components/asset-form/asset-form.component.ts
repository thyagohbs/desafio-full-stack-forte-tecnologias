import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss'],
})
export class AssetFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  assetTypes: string[] = [
    'Notebook',
    'Monitor',
    'Teclado',
    'Mouse',
    'Acessório',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Asset,
    private assetService: AssetService,
    private notificationService: NotificationService
  ) {
    this.isEditMode = !!this.data;
    this.form = this.fb.group({
      name: ['', Validators.required],
      tag: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.form.patchValue(this.data);
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const assetData = this.form.value;

    const operation$ = this.isEditMode
      ? this.assetService.update(this.data.id, assetData)
      : this.assetService.create(assetData);

    const message = this.isEditMode ? 'atualizado' : 'criado';

    operation$.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Ativo ${message} com sucesso!`);
        this.dialogRef.close(true);
      },
      error: () =>
        this.notificationService.showError(
          `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} ativo.`
        ),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
