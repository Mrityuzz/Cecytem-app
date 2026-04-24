/* La clase AppComponent gestiona el título, el layout y ahora también
   verifica la sesión activa del usuario para evitar que se pierda al
   rotar o cambiar de tema. */

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header';
import { AuthService } from './services/auth'; // Importa tu servicio

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tituloModulo = '';
  mostrarLayout = false;   
  currentRoute: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.currentRoute = url;
        this.actualizarTitulo(url);
        this.actualizarLayout(url);
      }
    });
  }

  ngOnInit() {
    // Escuchar el estado de sesión persistente
    this.authService.getAuthState(user => {
      if (user) {
        // Usuario sigue logueado → si está en login, lo mandamos al dashboard
        if (this.currentRoute.startsWith('/auth')) {
          this.router.navigate(['/dashboard']);
        }
      } else {
        // No hay sesión → siempre login
        this.router.navigate(['/auth/login']);
      }
    });
  }

  private actualizarTitulo(url: string): void {
    if (url.startsWith('/dashboard')) {
      this.tituloModulo = 'Credencial Digital';
    } else if (url.startsWith('/asistencia')) {
      this.tituloModulo = 'Asistencia';
    } else if (url.startsWith('/reportes')) {
      this.tituloModulo = 'Reportes';
    } else if (url.startsWith('/cuenta')) {
      this.tituloModulo = 'Cuenta';
    } else {
      this.tituloModulo = '';
    }
  }

  private actualizarLayout(url: string): void {
    this.mostrarLayout = !url.startsWith('/auth');
  }

  navegar(ruta: string) {
    if (this.currentRoute.startsWith('/' + ruta.split('/')[0])) {
      const navItem = document.querySelector(`.bottom-nav a[data-route="${ruta}"]`);
      navItem?.classList.add('refreshing');

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([ruta]).then(() => {
          setTimeout(() => navItem?.classList.remove('refreshing'), 1500);
        });
      });
    } else {
      this.router.navigate([ruta]);
    }
  }
}
