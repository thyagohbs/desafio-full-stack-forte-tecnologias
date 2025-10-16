import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssociateAssetDialogComponent } from '../../components/associate-asset-dialog/associate-asset-dialog.component';
import { AssetService } from '../../../../core/services/asset.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule,
    AssociateAssetDialogComponent,
  ],
})
export class EmployeeDetailsComponent implements OnInit {
  employee$!: Observable<Employee | undefined>;
  employeeId!: string;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails(): void {
    this.employee$ = this.employeeService.getById(this.employeeId);
  }

  openAssociateAssetDialog(): void {
    const dialogRef = this.dialog.open(AssociateAssetDialogComponent, {
      width: '400px',
      data: { employeeId: this.employeeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployeeDetails();
        this.notificationService.showSuccess('Ativo associado com sucesso.');
      }
    });
  }

  dissociateAsset(assetId: string): void {
    if (confirm('Tem certeza que deseja desassociar este ativo?')) {
      this.assetService.disassociateAsset(assetId).subscribe({
        next: () => {
          this.loadEmployeeDetails();
          this.notificationService.showSuccess(
            'Ativo desassociado com sucesso.'
          );
        },
        error: (err: any) => {
          this.notificationService.showError(
            err.error.message || 'Erro ao desassociar o ativo.'
          );
        },
      });
    }
  }
}
