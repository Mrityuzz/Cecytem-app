import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'asistencia',
    loadChildren: () =>
      import('./modules/asistencia/asistencia-module').then(m => m.AsistenciaModule)
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('./modules/reportes/reportes-module').then(m => m.ReportesModule)
  },
  {
    path: 'cuenta',
    loadChildren: () =>
      import('./modules/cuenta/cuenta-module').then(m => m.CuentaModule)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full' // ✅ redirección inicial clara
  },
  {
    path: '**',
    redirectTo: 'auth/login' // ✅ comodín global
  }
];
