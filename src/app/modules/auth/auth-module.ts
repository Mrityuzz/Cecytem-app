import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Registro } from './registro/registro';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    Login,      
    Registro    
  ]
})
export class AuthModule {}
