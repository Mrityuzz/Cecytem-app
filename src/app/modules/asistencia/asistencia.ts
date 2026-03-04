import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from './asistencia.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.html',
  styleUrls: ['./asistencia.scss']
})
export class AsistenciaComponent implements OnInit {
  mensaje: string = '';

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.asistenciaService.registrarAsistencia(userId).subscribe(res => {
        this.mensaje = res.mensaje || 'Tu asistencia ha sido registrada en la hoja de cálculo.';
      });
    }
  }
}
