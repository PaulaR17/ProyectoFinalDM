import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-professor-profile',
  templateUrl: './professor-profile.page.html',
  styleUrls: ['./professor-profile.page.scss'],
})
export class ProfessorProfilePage implements OnInit {
  currentSegment = 'user';

  professor = {
    imagen: 'ruta/a/la/imagen.jpg',
    name: 'Dr. Antonio García',
    title: 'Profesor Titular - Departamento de Informática',
    tfgsDirigidos: 15,
    enCurso: 3,
    matches: 8,
    tfgs: [
      { title: 'Sistema de IA para Detección de Fraude', student: 'María López', status: 'En Curso' },
      { title: 'Blockchain en Smart Cities', student: 'Juan Pérez', status: 'Evaluado' },
      { title: 'Desarrollo de App IoT', student: 'Ana Martínez', status: 'Terminado' }
    ]
  };

  constructor(private alertController: AlertController) {}

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

  editProfile() {
    console.log('Editando perfil...');
    // Aquí puedes agregar la lógica para editar el perfil
  }
}