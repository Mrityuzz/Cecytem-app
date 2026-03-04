import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header';

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
export class AppComponent {
  tituloModulo = '';
  mostrarLayout = false;   // por defecto login/registro

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.actualizarTitulo(url);
        this.actualizarLayout(url);
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
    // ✅ Si la ruta empieza con /auth → mostrar login/registro
    if (url.startsWith('/auth')) {
      this.mostrarLayout = false;
    } else {
      this.mostrarLayout = true;
    }
  }
}
