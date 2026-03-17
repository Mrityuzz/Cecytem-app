import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from './asistencia.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.html',
  styleUrls: ['./asistencia.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AsistenciaComponent implements OnInit {
  asistencia: { entrada: string, salida: string }[] = [];
  mensaje: string = '';

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    // Recupera el número de control guardado en sesión/localStorage
    const numeroControl = localStorage.getItem('numeroControl')?.trim();

    if (numeroControl && numeroControl.length > 0) {
      this.asistenciaService.obtenerAsistencia(numeroControl).subscribe({
        next: (data) => {
          this.asistencia = data;
          this.mensaje = data.length > 0
            ? 'Historial cargado desde la hoja de cálculo.'
            : 'No se encontraron registros de asistencia.';
          console.log('Datos de asistencia:', data); // debug en consola
        },
        error: (err) => {
          console.error('Error al obtener asistencia', err);
          this.mensaje = 'Error al cargar asistencia desde la hoja.';
        }
      });
    } else {
      this.mensaje = 'No se encontró número de control en sesión.';
    }
  }
}
