import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UniqueIdService } from 'src/app/shared/services/unique-id.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpResponse = {
    status: "",
    message: ""
  }
  formSubmitted = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private guid: UniqueIdService,
    private validator: ValidatorService
  ) {}

  form: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern(this.validator.usernamePattern),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.validator.emailPattern),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(this.validator.passwordPattern),
    ]),
    agreement: new FormControl(true, [Validators.required]),
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.formSubmitted = false);
  }

  onSubmit(formValue: any) {
    this.formSubmitted = true;
    this.signUpResponse = {
      status: "pending",
      message: 'We are checking the provided credentials'
    };
    let newUser: IUser = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      id: this.guid.generateId(),
      listGroupId: this.guid.generateId(),
    };
    // check user uniqueness
    this.userService
      .getAll()
      .pipe(
        map((users: IUser[]) => {
          for (let i = 0; i < users.length; i++) {
            if (
              users[i].email == newUser.email &&
              users[i].username == newUser.username
            ) {
              this.signUpResponse = {
                status: "failure",
                message: 'User with the same username and email already exists'
              };
              return false;
            } else if (users[i].email == newUser.email) {
              this.signUpResponse = {
                status: "failure",
                message: 'User with the same email already exists'
              };
              return false;
            } else if (users[i].username == newUser.username) {
              this.signUpResponse = {
                status: "failure",
                message: 'User with the same username already exists'
              };
              return false;
            }
          }
          this.signUpResponse = {
            status: "success",
            message: 'Succesfully registered'
          };
          return true;
        })
      )
      .subscribe((userIsUnique) => {
        if (userIsUnique) {
          this.userService.create(newUser).subscribe();
          if (this.signUpResponse.status == 'success') {
            setTimeout(() => {
              this.form.reset();
              this.router.navigate(['authentication/signin']);
            }, 1500);
          }
        }
      });
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get username() {
    return this.form.get('username') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get agreement() {
    return this.form.get('agreement') as FormControl;
  }
  // showPlaceholderImg(){
  //   this.imageSrc = '../../../assets/shared_images/placeholder-img.png';
  // }
}
