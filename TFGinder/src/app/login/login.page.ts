import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { UserService } from '../services/user.service'; // Servicio compartido
import { first } from 'rxjs/operators'; // Para manejar observables con Firestore

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private userService: UserService // Servicio para manejar el usuario actual
  ) {}

  async login() {
    try {
      // Autenticar al usuario con Firebase Authentication
      const userCredential = await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );

      const uid = userCredential.user?.uid; // UID del usuario autenticado

      if (uid) {
        // Obtener el documento del usuario desde Firestore
        const userDoc = await this.firestore
          .collection('users')
          .doc(uid)
          .valueChanges()
          .pipe(first()) // Obtiene un único valor del observable
          .toPromise();

        if (userDoc) {
          const userData: any = userDoc;

          // Guardar el UID y rol en el servicio compartido
          this.userService.setUser(uid, userData.role);

          // Redirigir al componente de tabs
          this.router.navigateByUrl('/tabs');
        } else {
          throw new Error('No se encontraron datos del usuario en Firestore.');
        }
      } else {
        throw new Error('No se pudo obtener el UID del usuario.');
      }
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error.message);
      this.showAlert('Inicio de sesión fallido', error.message);
    }
  }

  // Mostrar alertas en caso de error
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
