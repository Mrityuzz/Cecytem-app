/* La clase AppComponent en este código TypeScript es responsable de gestionar el título y el 
diseño en función de la ruta actual en una aplicación Angular, así como de manejar los eventos de 
navegación y mantener la sesión activa al rotar o cambiar tema. */

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from '@angular/fire/auth';

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

  constructor(private router: Router, private auth: Auth) {
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
    // Escuchar el estado de sesión, pero sin login automático
    onAuthStateChanged(this.auth, user => {
      if (user) {
        // Usuario ya logueado → mantener sesión activa
        console.log('Sesión activa, usuario sigue logueado');
        // ❌ No redirigir automáticamente al dashboard
      } else {
        // No hay sesión → mostrar login si no estás ya en /auth
        if (!this.currentRoute.startsWith('/auth')) {
          this.router.navigate(['/auth/login']);
        }
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
