import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private readonly apiUrl = 'http://localhost:8000/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas/${userId}`);
  }

  descargarExcel(userId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/excel/${userId}`, {
      responseType: 'blob'
    });
  }
}
