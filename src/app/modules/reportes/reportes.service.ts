import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private sheetId = '11B1vWbYto5hD0G0FNMIqUkx7W-HxTeE4fzq1bqLytiU'; // hoja de asistencia
  private apiKey = 'AIzaSyCXp6fyBDUtwfVNNisHD-EEcW0JCWyLALQ';       // clave API
  private range = 'Hoja1!A:G'; // rango de columnas

  constructor(private http: HttpClient) {}

  /**
   * Devuelve todas las filas con Numero de control, Entrada, Salida y Veces
   */
  obtenerDatosReportes(): Observable<{
    numero_control: string; entrada: string; salida: string; veces: string;
  }[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const filas = res.values || [];
        return filas.slice(1) // saltar encabezados
          .map((fila: any[]) => ({
            numero_control: fila[1] || '', //  Columna B (Número de control)
            entrada: fila[4] || '',        //  Columna E (Entrada)
            salida: fila[5] || '',         //  Columna F (Salida)
            veces: fila[6] || ''           //  Columna G (Veces)
          }));
      })
    );
  }
}
