/* La clase AuthService proporciona métodos para iniciar y cerrar sesión 
   utilizando autenticación por correo electrónico y contraseña con AngularFire,
   además de mantener la sesión persistente. */

import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged, 
  User 
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  // Login con persistencia en localStorage
  async login(email: string, password: string) {
    await setPersistence(this.auth, browserLocalPersistence);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Escuchar el estado del usuario (mantener sesión activa)
  getAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}
