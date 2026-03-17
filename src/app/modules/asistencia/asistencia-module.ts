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
