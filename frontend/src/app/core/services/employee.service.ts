import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Asset } from '../models/asset.model';
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from '../models/employee.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$: Observable<Employee[]> =
    this.employeesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getEmployeesByCompany(companyId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.apiUrl}/companies/${companyId}/employees`
    );
  }

  createEmployee(
    employee: Omit<Employee, 'id' | 'company'>
  ): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getAssetsByEmployee(employeeId: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/${employeeId}/assets`);
  }

  getAll(companyId?: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }
    return this.http.get<Employee[]>(this.apiUrl, { params }).pipe(
      tap((employees) => {
        this.employeesSubject.next(employees);
      })
    );
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap(() => {
        this.getAll().subscribe();
      })
    );
  }

  update(id: string, employee: UpdateEmployeeDto): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      tap(() => {
        this.getAll().subscribe();
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.getAll().subscribe();
      })
    );
  }
}
