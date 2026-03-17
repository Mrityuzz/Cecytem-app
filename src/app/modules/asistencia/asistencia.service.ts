import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private sheetId = '11B1vWbYto5hD0G0FNMIqUkx7W-HxTeE4fzq1bqLytiU';
  private apiKey = 'AIzaSyCXp6fyBDUtwfVNNisHD-EEcW0JCWyLALQ';

  constructor(private http: HttpClient) {}

  /**
   * Devuelve las horas de entrada y salida filtradas por número de control
   */
  obtenerAsistencia(numeroControl: string): Observable<{entrada: string, salida: string}[]> {
    // URL corregida con Hoja1 y rango A:G
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Hoja1!A:G?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const filas = res.values || [];
        return filas.slice(1) // saltar encabezados
          .filter((fila: any[]) => fila[1]?.trim() === numeroControl.trim()) // columna B = número de control
          .map((fila: any[]) => ({
            entrada: fila[4] || '',
            salida: fila[5] || ''
          }));
      })
    );
  }
}
