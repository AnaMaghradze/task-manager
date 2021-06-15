import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() onSignOut = new EventEmitter();
  @Output() onThemeChange = new EventEmitter();
  @Input() authorizedUser: IUser = {
    id: '',
    email: '',
    password: '',
    listGroupId: '',
    username: 'Not Signed In',
  };
  toggler = false; // ????
  sidebarOpen = false;
  isThemeDark = false;
  imgSrc = '../../../assets/avatar.png';

  toggle() {
    if (this.toggler) {
      this.sidebarOpen = !this.sidebarOpen;
      this.toggler = false;
    } else {
      this.toggler = true;
      setTimeout(() => {
        this.sidebarOpen = !this.sidebarOpen;
      }, 500);
    }
  }

  signout(e: any) {
    this.onSignOut.emit(e);
  }

  switchTheme(e: any) {
    this.isThemeDark = !this.isThemeDark;
    this.onThemeChange.emit(this.isThemeDark);
  }
}
