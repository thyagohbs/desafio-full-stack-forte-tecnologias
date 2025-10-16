import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class AssetFormComponent implements OnInit {
  assetForm: FormGroup;
  isEditMode: boolean;
  assetTypes: string[] = ['NOTEBOOK', 'MONITOR', 'TECLADO', 'MOUSE'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { asset: Asset },
    private assetService: AssetService,
    private notificationService: NotificationService
  ) {
    this.isEditMode = !!data.asset; // Verifica se um ativo foi passado para o diálogo

    this.assetForm = this.fb.group({
      name: [this.isEditMode ? data.asset.name : '', Validators.required],
      type: [this.isEditMode ? data.asset.type : '', Validators.required],
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.assetForm.valid) {
      this.dialogRef.close(this.assetForm.value);
    }
  }

  save(): void {
    if (this.assetForm.invalid) {
      return;
    }

    const assetData = this.assetForm.value;

    if (this.isEditMode) {
      this.assetService.update(this.data.asset.id, assetData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Ativo atualizado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) =>
          this.notificationService.showError(
            err.error.message || 'Erro ao atualizar ativo.'
          ),
      });
    } else {
      this.assetService.create(assetData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Ativo criado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) =>
          this.notificationService.showError(
            err.error.message || 'Erro ao criar ativo.'
          ),
      });
    }
  }
}
