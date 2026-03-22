import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReportesService } from './reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss']
})
export class ReportesComponent implements OnInit {
descargarExcel() {
throw new Error('Method not implemented.');
}
  totalEntradas = 0;
  totalSalidas = 0;
  promedioEntradas = 0;
  promedioSalidas = 0;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.reportesService.obtenerDatosReportes().subscribe({
      next: (rows) => {
        const entradas = rows.filter(r => r.entrada);
        const salidas = rows.filter(r => r.salida);

        this.totalEntradas = entradas.length;
        this.totalSalidas = salidas.length;

        const diasEntradas = [...new Set(entradas.map(e => e.entrada.split(' ')[0]))];
        const diasSalidas = [...new Set(salidas.map(s => s.salida.split(' ')[0]))];

        this.promedioEntradas = diasEntradas.length > 0 
          ? +(this.totalEntradas / diasEntradas.length).toFixed(1) 
          : 0;

        this.promedioSalidas = diasSalidas.length > 0 
          ? +(this.totalSalidas / diasSalidas.length).toFixed(1) 
          : 0;
      },
      error: (err) => console.error('Error al cargar estadísticas:', err)
    });
  }
}
