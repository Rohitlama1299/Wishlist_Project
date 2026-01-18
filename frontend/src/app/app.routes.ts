import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'explore',
        loadComponent: () => import('./features/locations/explore/explore.component').then(m => m.ExploreComponent)
      },
      {
        path: 'destinations',
        loadComponent: () => import('./features/destinations/destinations-list/destinations-list.component').then(m => m.DestinationsListComponent)
      },
      {
        path: 'destinations/:id',
        loadComponent: () => import('./features/destinations/destination-detail/destination-detail.component').then(m => m.DestinationDetailComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
