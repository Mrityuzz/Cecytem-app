/* La clase AsistenciaModule es un módulo de Angular que importa módulos comunes, el módulo 
de enrutamiento y el componente para gestionar la asistencia, y proporciona DatePipe 
como proveedor. */
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AsistenciaRoutingModule } from './asistencia-routing-module';
import { AsistenciaComponent } from './asistencia';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AsistenciaRoutingModule,
    AsistenciaComponent
  ],
  providers: [
    DatePipe
  ]
})
export class AsistenciaModule {}
