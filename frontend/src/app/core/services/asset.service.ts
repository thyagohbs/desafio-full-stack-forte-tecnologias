import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Asset,
  AssignAssetDto,
  CreateAssetDto,
  UpdateAssetDto,
} from '../models/asset.model';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private readonly apiUrl = `${environment.apiUrl}/assets`;

  constructor(private http: HttpClient) {}

  getAll(employeeId?: string, unassigned?: boolean): Observable<Asset[]> {
    let params = new HttpParams();
    if (employeeId) {
      params = params.set('employeeId', employeeId);
    }
    if (unassigned) {
      params = params.set('unassigned', 'true');
    }
    return this.http.get<Asset[]>(this.apiUrl, { params });
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

  assign(id: string, payload: AssignAssetDto): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${id}/assign`, payload);
  }

  unassign(id: string): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${id}/unassign`, {});
  }
}
