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
    const numeroControl = localStorage.getItem('numeroControl');
    if (numeroControl) {
      this.cuentaService.obtenerCuenta(numeroControl).subscribe(data => {
        this.cuenta = data;
      });
    }
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    localStorage.removeItem('numeroControl'); 
    this.router.navigate(['/auth/login']); 
  }
}
