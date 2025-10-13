import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asset, CreateAssetDto, UpdateAssetDto } from '../models/asset.model';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiUrl = `${environment.apiUrl}/assets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  getById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/${id}`);
  }

  create(asset: CreateAssetDto): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, asset);
  }

  update(id: string, asset: UpdateAssetDto): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${id}`, asset);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignToEmployee(assetId: string, employeeId: string): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${assetId}/assign`, {
      employeeId,
    });
  }

  unassignFromEmployee(assetId: string): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${assetId}/unassign`, {});
  }
}
