import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CuentaService } from './cuenta.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuenta.html',
  styleUrls: ['./cuenta.scss']
})
export class CuentaComponent implements OnInit {
  cuenta: any;

  constructor(
    private cuentaService: CuentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cuentaService.obtenerCuenta(userId).subscribe(data => {
        this.cuenta = data;
      });
    }
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    localStorage.removeItem('userId'); 
    this.router.navigate(['/auth/login']); 
  }
}
