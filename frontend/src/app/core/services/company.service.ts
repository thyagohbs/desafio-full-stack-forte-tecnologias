import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
} from '../models/company.model';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = `${environment.apiUrl}/companies`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(company: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  update(id: string, company: UpdateCompanyDto): Observable<Company> {
    return this.http.patch<Company>(`${this.apiUrl}/${id}`, company);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEmployees(companyId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/${companyId}/employees`);
  }
}
