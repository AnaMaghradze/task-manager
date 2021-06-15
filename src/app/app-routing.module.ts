import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { IsSignedInGuard } from './shared/guards/is-signed-in.guard';
import { IsSignedOutGuard } from './shared/guards/is-signed-out.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    canActivate: [IsSignedOutGuard],
    children: [
      {
        path: 'signin',
        component: SignInComponent,
      },
      {
        path: 'signup',
        component: SignUpComponent,
      },
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'prefix',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/authentication',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
