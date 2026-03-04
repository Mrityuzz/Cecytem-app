import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  constructor(private firestore: Firestore) {}

  // Obtener datos de un alumno por número de control
  getAlumno(numeroControl: string): Observable<any> {
    const ref = doc(this.firestore, `alumnos/${numeroControl}`);
    return docData(ref); // devuelve un Observable en tiempo real
  }
}
