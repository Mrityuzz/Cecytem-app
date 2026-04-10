/* La clase AsistenciaComponent en TypeScript es responsable de gestionar los datos de asistencia 
y manejar los cambios de autenticación utilizando Firebase Auth en una aplicación Angular. */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from './asistencia.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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

  private auth = inject(Auth);

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    //  Escuchar cambios de sesión en Firebase Auth
    onAuthStateChanged(this.auth, user => {
      if (user?.email) {
        const numeroControl = user.email.split('@')[0].trim();

        this.asistenciaService.obtenerAsistencia(numeroControl).subscribe({
          next: (data) => {
            this.asistencia = data;
            this.mensaje = data.length > 0
              ? 'Historial cargado desde la hoja de cálculo.'
              : 'No se encontraron registros de asistencia.';
            console.log('Datos de asistencia:', data);
          },
          error: (err) => {
            console.error('Error al obtener asistencia', err);
            this.mensaje = 'Error al cargar asistencia desde la hoja.';
          }
        });
      } else {
        this.mensaje = 'No hay sesión activa.';
      }
    });
  }
}
