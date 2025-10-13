import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asset } from '../models/asset.model';
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private readonly http: HttpClient) {}

  create(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: string, employee: UpdateEmployeeDto): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAssets(employeeId: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/${employeeId}/assets`);
  }

  getEmployeesByCompany(companyId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.apiUrl}/companies/${companyId}/employees`
    );
  }

  getEmployeeAssets(employeeId: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/${employeeId}/assets`);
  }
}
