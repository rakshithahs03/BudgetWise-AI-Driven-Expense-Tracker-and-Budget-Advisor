import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login'
import { RegisterComponent } from './auth/register/register';
import { ProfileComponent } from './auth/profile/profile';
import {HomeComponent} from './home/home';
import {DashboardComponent} from './features/dashboard/dashboard';
import { ProfilePageComponent } from './features/profile-page/profile-page';
import {authGuard} from './core/guards/auth-guard';
import {AnalysisPageComponent} from './features/analysis-detail/analysis-detail';
import {TransactionsPageComponent} from './features/transaction/transactions-page/transactions-page';
import {AnalysisHubComponent} from './features/analysis-hub/analysis-hub';
import {ForumPageComponent} from './features/forum/forum-page/forum-page';
import {PostDetailComponent} from './features/forum/post-detail/post-detail';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/profile', component: ProfileComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'analysis/details/:type', component: AnalysisPageComponent, canActivate: [authGuard] },
  { path: 'analysis', component: AnalysisHubComponent },
  { path: 'transactions', component: TransactionsPageComponent, canActivate: [authGuard] },
  { path: 'forum', component: ForumPageComponent, canActivate: [authGuard] },
  { path: 'forum/:postId', component: PostDetailComponent, canActivate: [authGuard] },

];
