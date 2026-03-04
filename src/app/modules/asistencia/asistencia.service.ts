import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:8000/api/asistencia'; // Ajusta según tu backend Django/Jupyter

  constructor(private http: HttpClient) {}

  registrarAsistencia(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, { userId });
  }
}
