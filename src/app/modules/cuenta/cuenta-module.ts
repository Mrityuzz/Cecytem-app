/* La clase CuentaModule es un módulo de Angular que importa CommonModule y 
CuentaRoutingModule. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentaRoutingModule } from './cuenta-routing-module';

@NgModule({
  imports: [
    CommonModule,
    CuentaRoutingModule
  ]
})
export class CuentaModule {}
