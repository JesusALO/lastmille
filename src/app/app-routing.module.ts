import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
const routes: Routes = [

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'signinform',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate:[AuthGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'map',
    canActivate:[AuthGuard],
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'signinform',
    loadChildren: () => import('./signinform/signinform.module').then( m => m.SigninformPageModule)
  },
  {
    path: 'orders',
    canActivate:[AuthGuard],
    loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'confirmed-orders',
    // canActivate:[AuthGuard],
    loadChildren: () => import('./confirmed-orders/confirmed-orders.module').then( m => m.ConfirmedOrdersPageModule)
  },
  {
    path: 'control-panel',
    canActivate:[AuthGuard],
    loadChildren: () => import('./control-panel/control-panel.module').then( m => m.ControlPanelPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
