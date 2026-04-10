/* La clase ReportesModule es un módulo de Angular que importa CommonModule y 
ReportesRoutingModule */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing-module';

@NgModule({
  declarations: [], 
  imports: [
    CommonModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule {}
