import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthHeader } from "../header/header";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, AuthHeader],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class Registro {
  numeroControl: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onRegister() {
    if (!this.numeroControl || !this.newPassword || !this.confirmPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Contraseña registrada para:', this.numeroControl);
    alert('Contraseña registrada correctamente. Ahora inicia sesión.');

    this.router.navigate(['/auth/login']);
  }
}
