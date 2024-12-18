import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {
  chats = [
    {
      name: 'Dra. María López',
      preview: '¡Hola! Me interesa tutorizar tu TFG sobre metodologías ágiles.',
      time: '12:30',
      unread: 0,
      imagen: 'ruta/a/la/imagen1.jpg'
    },
    {
      name: 'Dr. Juan Martínez',
      preview: '¿Te gustaría explorar un proyecto en Cloud Computing?',
      time: 'Ayer',
      unread: 0,
      imagen: 'ruta/a/la/imagen2.jpg'
    },
    {
      name: 'Dra. Ana García',
      preview: 'Podemos reunirnos para discutir tu propuesta de Machine Learning',
      time: 'Lun',
      unread: 0,
      imagen: 'ruta/a/la/imagen3.jpg'
    },
  ];

  currentSegment = 'chats';

  constructor(private alertController: AlertController,private router: Router) {}

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

  openChat(chat: any) {
    this.router.navigateByUrl('/chat'); 
  }
}