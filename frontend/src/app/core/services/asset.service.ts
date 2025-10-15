import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Asset } from '../models/asset.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiUrl = `${environment.apiUrl}/assets`;

  private assetsSubject = new BehaviorSubject<Asset[]>([]);
  public assets$: Observable<Asset[]> = this.assetsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl).pipe(
      tap((assets) => {
        this.assetsSubject.next(assets); // Atualiza o BehaviorSubject
      })
    );
  }

  create(asset: Omit<Asset, 'id'>): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, asset).pipe(
      tap((newAsset) => {
        const currentAssets = this.assetsSubject.getValue();
        this.assetsSubject.next([...currentAssets, newAsset]); // Adiciona o novo ativo à lista
      })
    );
  }

  update(id: string, asset: Partial<Asset>): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${id}`, asset).pipe(
      tap((updatedAsset) => {
        const currentAssets = this.assetsSubject.getValue();
        const updatedAssets = currentAssets.map((a) =>
          a.id === id ? updatedAsset : a
        );
        this.assetsSubject.next(updatedAssets); // Atualiza o ativo na lista
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentAssets = this.assetsSubject.getValue();
        const remainingAssets = currentAssets.filter((a) => a.id !== id);
        this.assetsSubject.next(remainingAssets); // Remove o ativo da lista
      })
    );
  }

  // Métodos que não alteram a lista principal não precisam modificar o Subject
  getById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/${id}`);
  }

  getAvailableAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}`, {
      params: { status: 'Disponível' },
    });
  }
}
