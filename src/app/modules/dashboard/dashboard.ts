/* La clase DashboardComponent en TypeScript es responsable de obtener y mostrar las 
credenciales de usuario desde Firestore basándose en el estado de autenticación del usuario. */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

// Interface para tipar la credencial
interface Credencial {
  nombre: string;
  carrera_tecnica: string;
  numero_control: string;
  activo: boolean;
  anios: number[];
  foto_url: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  credencial$: Observable<Credencial> | null = null;
  currentYear: number = new Date().getFullYear();

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  ngOnInit() {
    // Escuchar cambios de sesión en Firebase Auth
    onAuthStateChanged(this.auth, user => {
      if (user?.email) {
        const numeroControl = user.email.split('@')[0]; 
        const ref = doc(this.firestore, `alumnos/${numeroControl}`);
        this.credencial$ = docData(ref) as Observable<Credencial>;
      }
    });
  }
}
