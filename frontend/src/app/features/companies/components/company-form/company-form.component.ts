import { Component, Inject, OnInit, Optional } from '@angular/core';
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
import { Company } from '../../../../core/models/company.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CompanyService } from '../../../../core/services/company.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class CompanyFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { company: Company },
    private companyService: CompanyService,
    private notificationService: NotificationService
  ) {
    this.isEditMode = !!this.data?.company;
    this.form = this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    });

    if (this.isEditMode) {
      this.form.patchValue(this.data.company);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    const companyData = this.form.value;

    if (this.isEditMode) {
      this.companyService.update(this.data.company.id, companyData).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Empresa atualizada com sucesso!'
          );
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.notificationService.showError('Erro ao atualizar a empresa.');
          console.error(err);
        },
      });
    } else {
      this.companyService.create(companyData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Empresa criada com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.notificationService.showError('Erro ao criar a empresa.');
          console.error(err);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
