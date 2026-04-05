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
  mostrarLayout = false;   
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.currentRoute = url;
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
    this.mostrarLayout = !url.startsWith('/auth');
  }

  navegar(ruta: string) {
    // Si ya estás en la ruta → refresca
    if (this.currentRoute.startsWith('/' + ruta.split('/')[0])) {
      const navItem = document.querySelector(`.bottom-nav a[data-route="${ruta}"]`);
      navItem?.classList.add('refreshing');

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([ruta]).then(() => {
          setTimeout(() => navItem?.classList.remove('refreshing'), 1500);
        });
      });
    } else {
      // Navega normalmente
      this.router.navigate([ruta]);
    }
  }
}
