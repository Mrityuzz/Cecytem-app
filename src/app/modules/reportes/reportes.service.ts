import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private sheetId = '11B1vWbYto5hD0G0FNMIqUkx7W-HxTeE4fzq1bqLytiU'; // hoja de asistencia
  private apiKey = 'AIzaSyCXp6fyBDUtwfVNNisHD-EEcW0JCWyLALQ';       // clave API
  private range = 'Hoja1!A:G'; // rango de columnas

  constructor(private http: HttpClient, private firestore: Firestore) {}

  /**
   * 🔹 Devuelve todas las filas de Google Sheets
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
            numero_control: fila[1] || '', // Columna B (Número de control)
            entrada: fila[4] || '',        // Columna E (Entrada)
            salida: fila[5] || '',         // Columna F (Salida)
            veces: fila[6] || ''           // Columna G (Veces)
          }));
      })
    );
  }

  /**
   *  Devuelve historial del alumno desde Firebase
   * Forzamos que `fecha` siempre sea string "YYYY-MM-DD"
   */
  obtenerHistorial(numero_control: string): Observable<any[]> {
    const ref = collection(this.firestore, `alumnos/${numero_control}/historial`);
    return collectionData(ref, { idField: 'id' }).pipe(
      map(historial => historial.map((h: any) => ({
        ...h,
        fecha: h.fecha && typeof h.fecha === 'object' && h.fecha.toDate
          ? h.fecha.toDate().toISOString().split('T')[0] //  Timestamp → "YYYY-MM-DD"
          : String(h.fecha || '')                        //  String o vacío
      })))
    );
  }

  /**
   *  Devuelve datos del alumno desde Firebase
   */
  getAlumno(numero_control: string): Observable<any> {
    const ref = doc(this.firestore, `alumnos/${numero_control}`);
    return docData(ref, { idField: 'id' });
  }
}
