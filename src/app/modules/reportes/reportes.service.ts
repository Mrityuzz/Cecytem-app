import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private sheetId = '11B1vWbYto5hD0G0FNMIqUkx7W-HxTeE4fzq1bqLytiU'; // 🔹 misma hoja que Asistencia
  private apiKey = 'AIzaSyCXp6fyBDUtwfVNNisHD-EEcW0JCWyLALQ';       // 🔹 misma clave
  private range = 'Hoja1!A:G'; // 🔹 rango completo de columnas

  constructor(private http: HttpClient) {}

  /**
   * Devuelve todas las filas con Entrada, Salida y Veces
   */
  obtenerDatosReportes(): Observable<{entrada: string, salida: string, veces: string}[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const filas = res.values || [];
        return filas.slice(1) // saltar encabezados
          .map((fila: any[]) => ({
            entrada: fila[4] || '',
            salida: fila[5] || '',
            veces: fila[6] || ''
          }));
      })
    );
  }
}
