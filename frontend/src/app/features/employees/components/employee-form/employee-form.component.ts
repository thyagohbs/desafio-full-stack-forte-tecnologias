import { Component, Inject, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
import { Company } from '../../../../core/models/company.model';
import { Employee } from '../../../../core/models/employee.model';
import { CompanyService } from '../../../../core/services/company.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class EmployeeFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  companies$: Observable<Company[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { employee?: Employee; companyId?: string },
    private companyService: CompanyService
  ) {
    this.isEditMode = !!data?.employee;
    this.form = this.fb.group({
      name: [data?.employee?.name || '', Validators.required],
      email: [
        data?.employee?.email || '',
        [Validators.required, Validators.email],
      ],
      cpf: [data?.employee?.cpf || '', Validators.required],
      companyId: [
        data?.companyId || data?.employee?.companyId || null,
        Validators.required,
      ],
    });

    this.companies$ = this.companyService.companies$;
  }

  ngOnInit(): void {
    if (!this.data.companyId) {
      this.companyService.getAll().subscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
