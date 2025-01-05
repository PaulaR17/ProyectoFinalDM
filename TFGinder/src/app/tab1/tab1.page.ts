import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  professors: any[] = []; // Almacena los datos obtenidos de Firebase
  currentProfessorIndex = 0;
  currentProfessor: any = null;
  currentSegment = 'home';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private firestore: AngularFirestore // Inyección del servicio AngularFirestore
  ) {}

  ngOnInit() {
    this.loadProfessorsFromFirebase();
  }

  // Método para cargar los datos desde Firebase
  loadProfessorsFromFirebase() {
    this.firestore
      .collection('tfginder')
      .valueChanges({ idField: 'id' }) // Incluye el ID del documento
      .subscribe((data: any[]) => {
        console.log('Datos obtenidos:', data); // Verifica los datos
        this.professors = data;
        if (this.professors.length > 0) {
          this.currentProfessor = this.professors[this.currentProfessorIndex];
        }
      });
  }

  segmentChanged(event: any) {
    console.log(event.detail.value);
    // Aquí puedes agregar la lógica para cada pestaña (home, chats, user)
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Mensaje Importante',
      message: 'Esto es un mensaje de alerta.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  showNextProfessor() {
    this.currentProfessorIndex++;
    if (this.currentProfessorIndex >= this.professors.length) {
      this.currentProfessorIndex = 0;
    }
    this.currentProfessor = this.professors[this.currentProfessorIndex];
  }

  like() {
    if (!this.currentProfessor) {
      console.log("No hay profesor actual.");
      return;
    }
  
    const tfgId = this.currentProfessor.id; // ID único del TFG
    console.log("Intentando registrar interés en el TFG con ID:", tfgId);
  
    // Referencia al documento del TFG usando AngularFirestore
    const tfgDocRef = this.firestore.doc(`tfginder/${tfgId}`);
  
    // Obtener el valor actual de "interesados" y actualizarlo
    tfgDocRef
      .get()
      .subscribe((tfgDoc: any) => {
        if (!tfgDoc.exists) {
          console.error("El documento del TFG no existe.");
          return;
        }
  
        const tfgData = tfgDoc.data();
        if (!tfgData) {
          console.error("Los datos del TFG están vacíos.");
          return;
        }
  
        // Leer el valor actual y actualizarlo
        let currentInteresados = parseFloat(tfgData['interesados'] || '0.0');
        const newInteresados = (currentInteresados + 1.0).toFixed(1);
  
        // Actualizar el campo en Firestore
        tfgDocRef
          .update({
            interesados: newInteresados,
          })
          .then(() => {
            console.log("Interés registrado correctamente.");
            this.showNextProfessor(); // Mostrar el siguiente profesor
          })
          .catch((error) => {
            console.error("Error al registrar el interés:", error);
            alert("Ocurrió un problema al registrar tu interés. Intenta de nuevo.");
          });
      });
  }
  
  
  nope() {
    // Agregar la clase de animación para nope
    const card = document.getElementById('currentCard');
    card?.classList.add('nope-animation');

    // Esperar a que termine la animación antes de mostrar el siguiente profesor
    setTimeout(() => {
      card?.classList.remove('nope-animation');
      this.showNextProfessor();
    }, 500); // 500ms es la duración de la animación
  }

  mostrarDetallesProfesor() {
    this.router.navigate(['/professor-info']);
  }
}
