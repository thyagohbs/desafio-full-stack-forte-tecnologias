import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Asset } from '../../../../core/models/asset.model';
import { Employee } from '../../../../core/models/employee.model';
import { AssetService } from '../../../../core/services/asset.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-assets',
  templateUrl: './employee-assets.component.html',
  styleUrls: ['./employee-assets.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class EmployeeAssetsComponent implements OnInit {
  employee: Employee | null = null;
  employeeId!: string;
  associatedAssets: Asset[] = [];
  availableAssets: Asset[] = [];
  hasNotebook = false;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  loadData(): void {
    const employee$ = this.employeeService.getById(this.employeeId);
    const associatedAssets$ = this.assetService.getAssetsByEmployee(
      this.employeeId
    );
    const availableAssets$ = this.assetService.getAvailableAssets();

    forkJoin({
      employee: employee$,
      associated: associatedAssets$,
      available: availableAssets$,
    }).subscribe({
      next: ({ employee, associated, available }) => {
        this.employee = employee;
        this.associatedAssets = associated;
        this.availableAssets = available;
        this.checkIfHasNotebook();
      },
      error: () =>
        this.notificationService.showError('Erro ao carregar dados.'),
    });
  }

  checkIfHasNotebook(): void {
    this.hasNotebook = this.associatedAssets.some(
      (asset) => asset.type.toLowerCase() === 'notebook'
    );
  }

  associateAsset(assetId: string): void {
    this.assetService.associateAsset(assetId, this.employeeId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Ativo associado com sucesso!');
        this.loadData();
      },
      error: (err) =>
        this.notificationService.showError(
          err.error.message || 'Erro ao associar ativo.'
        ),
    });
  }

  disassociateAsset(assetId: string): void {
    this.assetService.disassociateAsset(assetId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Ativo desassociado com sucesso!');
        this.loadData();
      },
      error: () =>
        this.notificationService.showError('Erro ao desassociar ativo.'),
    });
  }
}
