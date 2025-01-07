import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Obtener el objeto completo del usuario loggeado como Observable
  getCurrentUser(): Observable<any> {
    return this.afAuth.authState; // Devuelve el usuario autenticado como un observable
  }

  // Obtener solo el ID del usuario actual como Promise
  getCurrentUserId(): Promise<string | null> {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return user.uid; // Devuelve el ID del usuario si existe
      } else {
        console.error('No hay un usuario autenticado');
        return null; // Maneja el caso en que no haya usuario
      }
    });
  }

  // Método para iniciar sesión
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión
  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
