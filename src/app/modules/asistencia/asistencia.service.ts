/* La clase AsistenciaService en TypeScript es un servicio de Angular que recupera datos de 
asistencia filtrados por ID de estudiante desde un documento de Google Sheets utilizando la API de Google Sheets. */
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
    // URL con Hoja1 y rango A:G
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Hoja1!A:G?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const filas = res.values || [];
        return filas.slice(1) 
          .filter((fila: any[]) => fila[1]?.trim() === numeroControl.trim()) 
          .map((fila: any[]) => ({
            entrada: fila[4] || '',
            salida: fila[5] || ''
          }));
      })
    );
  }
}
