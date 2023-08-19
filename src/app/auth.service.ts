import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Replace with your API base URL lol

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
      })
    };

    return this.http.post(`${this.baseUrl}/login`, loginData, httpOptions);
  }
  sendSMS(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`${this.baseUrl}/send-sms`, {}, httpOptions).pipe(
      tap((response) => console.log('SMS sent:', response)),
      catchError((error) => {
        console.log('Error sending SMS:', error);
        return throwError(error);
      })
    );
  }
  getCustomer(): Observable<any> {
    const url = `${this.baseUrl}/deliveryInfo`; // Replace '/customerInfo' with the appropriate API endpoint for customer information
    return this.http.get<any>(url).pipe(
      tap((response) => console.log(response)), // Log the response
      catchError((error) => {
        console.log('Error fetching customer information:', error); // Log any error
        return throwError(error); // Rethrow the error
      })
    );
  }

  getEmployee(): Observable<any> {
    const url = `${this.baseUrl}/driverList`; // Replace '/EmployeeInfo' with the appropriate API endpoint for Employee information
    return this.http.get<any>(url).pipe(
      tap((response) => console.log(response)), // Log the response
      catchError((error) => {
        console.log('Error fetching Employee information:', error); // Log any error
        return throwError(error); // Rethrow the error
      })
    );
  }

  createEmployee(employeeData: any): Observable<any> {
    const url = `${this.baseUrl}/add`; // Replace '/add' with the appropriate API endpoint for adding employees
    return this.http.post<any>(url, employeeData).pipe(
      catchError((error) => {
        console.log('Error creating employee:', error); // Log any error
        return throwError(error); // Rethrow the error
      })
    );
  }

  updateEmployee(employeeId: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/updateDriverInfo/${employeeId}`; // Replace '/updateDriverInfo/:id' with the appropriate API endpoint for updating employee information
    return this.http.patch<any>(url, updatedData).pipe(
      catchError((error) => {
        console.log('Error updating employee:', error); // Log any error
        return throwError(error); // Rethrow the error
      })
    );
  }

  deleteEmployee(employeeId: string): Observable<any> {
    const url = `${this.baseUrl}/deleteDriver/${employeeId}`; // Replace '/deleteDriver/:id' with the appropriate API endpoint for deleting employees
    return this.http.delete<any>(url).pipe(
      catchError((error) => {
        console.log('Error deleting employee:', error); // Log any error
        return throwError(error); // Rethrow the error
      })
    );
  }
  
}
