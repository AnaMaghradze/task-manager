import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IList } from '../interfaces/list.interface';
import { ITask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  openedList!: IList;

  constructor(private http: HttpClient) {}

  // LISTS
  createList(list: IList): Observable<IList> {
    return this.http
      .post<IList>(`${environment.BASE_URL}lists`, list)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateList(list: IList): Observable<IList> {
    return this.http
      .put<IList>(`${environment.BASE_URL}lists/${list.id}`, list)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteList(id: any): Observable<IList> {
    return this.http
      .delete<IList>(`${environment.BASE_URL}lists/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getListById(id: any): Observable<IList> {
    return this.http
      .get<IList>(`${environment.BASE_URL}lists/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllLists(): Observable<IList[]> {
    return this.http
      .get<IList[]>(`${environment.BASE_URL}lists`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // TASKS
  createTask(task: ITask): Observable<ITask> {
    return this.http
      .post<ITask>(`${environment.BASE_URL}tasks`, task)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateTask(task: ITask): Observable<ITask> {
    return this.http
      .put<ITask>(
        `${environment.BASE_URL}tasks/${task.id}`,
        task
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteTask(id: any): Observable<void> {
    return this.http
      .delete<void>(`${environment.BASE_URL}tasks/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getTaskById(id: any): Observable<ITask> {
    return this.http
      .get<ITask>(`${environment.BASE_URL}tasks/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllTasks(): Observable<ITask[]> {
    return this.http
      .get<ITask[]>(`${environment.BASE_URL}tasks`)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    return throwError(errorMessage);
  }
}
