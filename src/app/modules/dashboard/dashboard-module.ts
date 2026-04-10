/* La clase DashboardModule es un módulo de Angular que importa CommonModule y 
DashboardRoutingModule. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing-module';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule]
})
export class DashboardModule {}
