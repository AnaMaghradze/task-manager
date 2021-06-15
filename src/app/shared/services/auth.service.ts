import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, retry, tap } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService, private router: Router) {}

  signIn(data: any) {
    this.checkUserExistance(data.username, data.password).subscribe(
      (registeredUser) => {
        if (registeredUser) {
          // set user id to localstorage
          localStorage.setItem('id', registeredUser.id);
          // save remembered username
          if (data.rememberMe) {
            localStorage.setItem('remembered', data.username);
          }
          // when authorized, navigate to home page
          this.router.navigate(['/home']);
        } else {
          // here goes notification
          console.log('username or password is incorrect');
        }
      }
    );
  }

  checkUserExistance(username: string, password: string) {
    return this.userService.getAll().pipe(
      map((users: IUser[]) => {
        return users.find(
          (user) => user.username == username && user.password == password
        );
      })
    );
  }

  signOut() {
    localStorage.removeItem('id');
    this.router.navigate(['/authentication']);
  }

  isUserSignedIn(): boolean {
    return localStorage.getItem('id') ? true : false;
  }

  getAuthorizedUser() {
    return this.userService.getById(localStorage.getItem('id')).pipe(retry(1));
  }
}
