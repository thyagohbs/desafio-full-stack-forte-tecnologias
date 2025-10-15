import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Company } from '../models/company.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/companies`;

  private companiesSubject = new BehaviorSubject<Company[]>([]);
  public companies$: Observable<Company[]> =
    this.companiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl).pipe(
      tap((companies) => {
        this.companiesSubject.next(companies);
      })
    );
  }

  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(company: Omit<Company, 'id'>): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company).pipe(
      tap((newCompany) => {
        const currentCompanies = this.companiesSubject.getValue();
        this.companiesSubject.next([...currentCompanies, newCompany]);
      })
    );
  }

  update(id: string, company: Partial<Company>): Observable<Company> {
    return this.http.patch<Company>(`${this.apiUrl}/${id}`, company).pipe(
      tap((updatedCompany) => {
        const currentCompanies = this.companiesSubject.getValue();
        const updatedCompanies = currentCompanies.map((c) =>
          c.id === id ? updatedCompany : c
        );
        this.companiesSubject.next(updatedCompanies);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentCompanies = this.companiesSubject.getValue();
        const remainingCompanies = currentCompanies.filter((c) => c.id !== id);
        this.companiesSubject.next(remainingCompanies);
      })
    );
  }
}
