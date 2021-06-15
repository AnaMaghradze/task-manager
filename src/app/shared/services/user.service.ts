import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  create(user: IUser): Observable<IUser> {
    return this.http
      .post<IUser>(`${environment.BASE_URL}users`, user)
      .pipe(retry(1), catchError(this.handleError));
  }

  update(user: IUser): Observable<IUser> {
    return this.http
      .put<IUser>(`${environment.BASE_URL}users/${user.id}`, user)
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(id: any): Observable<void> {
    return this.http
      .delete<void>(`${environment.BASE_URL}users/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getById(id: any): Observable<IUser> {
    return this.http
      .get<IUser>(`${environment.BASE_URL}users/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  
  getAll(): Observable<IUser[]> {
    return this.http
      .get<IUser[]>(`${environment.BASE_URL}users`)
      .pipe(retry(1), catchError(this.handleError));
  } 

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    return throwError(errorMessage);
  }
}
