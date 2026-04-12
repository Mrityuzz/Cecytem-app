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
  ) {
    //  Recuperar credenciales guardadas al abrir el login
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail) this.email = savedEmail;
    if (savedPassword) this.password = savedPassword;
  }

  async onLogin() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Login correcto:', userCredential.user);

      const numeroControl = this.email.split('@')[0];

      this.alumnoService.getAlumno(numeroControl).subscribe(alumno => {
        this.alumno = alumno;
        console.log('Alumno:', this.alumno);

        if (alumno) {
          localStorage.setItem('numeroControl', alumno.numero_control);
        }

        //  Guardar credenciales para autocompletar en el futuro
        localStorage.setItem('email', this.email);
        localStorage.setItem('password', this.password);

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
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    this.router.navigate(['/auth/login']);
  }
}
