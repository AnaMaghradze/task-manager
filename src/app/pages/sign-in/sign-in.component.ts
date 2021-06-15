import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInFailed = false;

  constructor(
    private authService: AuthService,
    private validator: ValidatorService
  ) {}

  form: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(this.validator.usernamePattern),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.validator.passwordPattern),
    ]),
    rememberMe: new FormControl(true),
  });

  ngOnInit(): void {
    this.showRememberedUser();
    this.form.valueChanges.subscribe(() => (this.signInFailed = false));
  }

  showRememberedUser() {
    let rememberedUser = localStorage.getItem('remembered');
    if (rememberedUser) {
      setTimeout(() => {
        this.form.get('username')!.setValue(rememberedUser);
      }, 100);
    }
  }

  onSubmit(value: any) {
    this.authService.signIn(value);
  }
}
