import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  constructor(private firestore: Firestore) {}

  /**
   * Recupera el documento del alumno en tiempo real desde Firestore
   * @param userId número de control del alumno
   * @returns Observable con los datos del alumno
   */
  obtenerCuenta(userId: string): Observable<any> {
    const ref = doc(this.firestore, `alumnos/${userId}`);
    return docData(ref, { idField: 'id' }); 
    // idField agrega el ID del documento al objeto resultante
  }
}
