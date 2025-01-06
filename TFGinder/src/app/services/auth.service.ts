import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Obtener el ID del usuario actual
  getCurrentUserId(): Promise<string | null> {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.uid; // Devuelve el ID del usuario si existe
      } else {
        console.error('No hay un usuario autenticado');
        return null; // Maneja el caso en que no haya usuario
      }
    });
  }

  // Método para iniciar sesión (opcional, si usas login)
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión (opcional)
  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
