/* La clase CuentaRoutingModule define las rutas para navegar hacia el componente 
CuentaComponent en una aplicación Angular. */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaComponent } from './cuenta'; 

const routes: Routes = [
  { path: 'perfil', component: CuentaComponent },
  { path: '', redirectTo: 'perfil', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaRoutingModule {}
