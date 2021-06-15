import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme = new Subject<boolean>();
  
  isThemeDark = this._theme.asObservable();

  setDarkTheme(isThemeDark: boolean): void {
    this._theme.next(isThemeDark);
  }
}
