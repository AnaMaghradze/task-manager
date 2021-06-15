import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  theme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isThemeDark
      .pipe(tap((th) => (this.theme = th)))
      .subscribe();
  }
}
