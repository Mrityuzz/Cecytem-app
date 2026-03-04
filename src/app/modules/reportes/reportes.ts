import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from './reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss']
})
export class ReportesComponent implements OnInit {
  estadisticas: any;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.reportesService.obtenerEstadisticas(userId).subscribe({
        next: (data: any) => this.estadisticas = data,
        error: (err) => console.error('Error al cargar estadísticas:', err)
      });
    }
  }

  descargarExcel(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.reportesService.descargarExcel(userId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_asistencias_${userId}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Error al descargar Excel:', err)
      });
    }
  }
}
