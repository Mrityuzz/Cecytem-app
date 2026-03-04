import { ApplicationConfig } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Rutas principales de la aplicación
    provideRouter(routes),

    // Inicialización de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Proveedor de autenticación
    provideAuth(() => getAuth()),

    // Proveedor de Firestore
    provideFirestore(() => getFirestore())
  ]
};
