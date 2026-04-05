import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CuentaService } from './cuenta.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuenta.html',
  styleUrls: ['./cuenta.scss']
})
export class CuentaComponent implements OnInit {
  cuenta: any;

  private auth = inject(Auth);

  constructor(
    private cuentaService: CuentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Escuchar cambios de sesión en Firebase Auth
    onAuthStateChanged(this.auth, user => {
      if (user?.email) {
        const numeroControl = user.email.split('@')[0];
        this.cuentaService.obtenerCuenta(numeroControl).subscribe(data => {
          this.cuenta = data;
        });
      }
    });
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    localStorage.removeItem('numeroControl'); 
    this.router.navigate(['/auth/login']); 
  }
}
