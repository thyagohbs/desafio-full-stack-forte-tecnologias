import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$: Observable<Employee[]> =
    this.employeesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap((employees) => {
        this.employeesSubject.next(employees);
      })
    );
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap((newEmployee) => {
        const currentEmployees = this.employeesSubject.getValue();
        this.employeesSubject.next([...currentEmployees, newEmployee]);
      })
    );
  }

  update(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      tap((updatedEmployee) => {
        const currentEmployees = this.employeesSubject.getValue();
        const updatedEmployees = currentEmployees.map((e) =>
          e.id === id ? updatedEmployee : e
        );
        this.employeesSubject.next(updatedEmployees);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentEmployees = this.employeesSubject.getValue();
        const remainingEmployees = currentEmployees.filter((e) => e.id !== id);
        this.employeesSubject.next(remainingEmployees);
      })
    );
  }
}
