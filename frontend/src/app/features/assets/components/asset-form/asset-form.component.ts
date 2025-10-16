import { NotificationService } from '../../../../core/services/notification.service';
import { Asset } from '../../../../core/models/asset.model';
import { AssetService } from '../../../../core/services/asset.service';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class AssetFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  assetTypes: string[] = ['NOTEBOOK', 'MONITOR', 'TECLADO', 'MOUSE'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Asset,
    private assetService: AssetService,
    private notificationService: NotificationService
  ) {
    this.isEditMode = !!this.data;
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      type: [this.data?.type || '', Validators.required],
    });
  }

  ngOnInit(): void {}

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const assetData = this.form.value;

    if (this.isEditMode) {
      this.assetService.update(this.data.id, assetData).subscribe({
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

  close(): void {
    this.dialogRef.close();
  }
}
