import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  professors = [
    {
      name: 'Dr. Ana García',
      department: 'Departamento de Informática',
      interests: 'Inteligencia Artificial, Machine Learning, Deep Learning',
      imagen: 'assets/images/Ana.png'
    },
    {
      name: 'Dr. Juan Martínez',
      department: 'Departamento de Sistemas',
      interests: 'Desarrollo Web, Cloud Computing, DevOps',
      imagen: 'assets/images/Juan.png' 
    },
    {
      name: 'Dra. María López',
      department: 'Departamento de Software',
      interests: 'Ingeniería de Software, Metodologías Ágiles',
      imagen: 'assets/images/Maria.png' 
    },
  ];

  currentProfessorIndex = 0;
  currentProfessor = this.professors[this.currentProfessorIndex];
  currentSegment = 'home';

  constructor(private alertController: AlertController, private router: Router) {}

  ngOnInit() {}

  segmentChanged(event: any) {
    console.log(event.detail.value);
    // Aquí puedes agregar la lógica para cada pestaña (home, chats, user)
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
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
    // Agregar la clase de animación para like
    const card = document.getElementById('currentCard');
    card?.classList.add('like-animation');

    // Esperar a que termine la animación antes de mostrar el siguiente profesor
    setTimeout(() => {
      card?.classList.remove('like-animation');
      this.showNextProfessor();
    }, 500); // 500ms es la duración de la animación
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