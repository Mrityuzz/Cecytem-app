/* La clase AsistenciaRoutingModule define la configuración de enrutamiento para el módulo de 
características de Asistencia en una aplicación Angular. */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './asistencia';

const routes: Routes = [
  { path: 'entrada', component: AsistenciaComponent },
  { path: '', redirectTo: 'entrada', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsistenciaRoutingModule {}
