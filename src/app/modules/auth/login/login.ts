import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthHeader } from "../header/header";
import { AuthService } from '../../../services/auth'; 
import { AlumnoService } from '../../../services/alumno';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AuthHeader],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email: string = '';
  password: string = '';
  alumno: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alumnoService: AlumnoService
  ) {}

  async onLogin() {
    try {
      // Login con Firebase Auth usando correo y contraseña
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Login correcto:', userCredential.user);

      // Derivar número de control desde el correo institucional (ejemplo: 202600123@cecytem.edu.mx)
      const numeroControl = this.email.split('@')[0];

      // Traer datos reales del alumno desde Firestore usando número de control como ID
      this.alumnoService.getAlumno(numeroControl).subscribe(alumno => {
        this.alumno = alumno;
        console.log('Alumno:', this.alumno);

        if (alumno) {
          // Guardar número de control en localStorage para que el Dashboard lo use
          localStorage.setItem('numeroControl', alumno.numero_control);
        }

        // Redirigir al dashboard
        this.router.navigate(['/dashboard/home']);
      });
    } catch (error) {
      alert('Correo o contraseña inválidos');
      console.error(error);
    }
  }

  onLogout() {
    this.authService.logout();
    this.email = '';
    this.password = '';
    this.router.navigate(['/auth/login']);
  }
}
