import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; 
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  user = {
    name: '',
    degree: '',
    email: '',
    image: 'assets/images/default.png', // Imagen por defecto
  };

  tfgs = [
    { title: 'Desarrollo de un sistema de IA para reconocimiento de patrones', professor: 'Prof. María González', status: 'Aceptado' },
    { title: 'Implementación de BlockChain en sistemas IoT', professor: 'Prof. Juan Martínez', status: 'Pendiente' }
  ];

  currentSegment = 'user';

  constructor(private alertController: AlertController,private router: Router, private userService: UserService) {}

  segmentChanged(event: any) {
    console.log(event.detail.value);
    // Aquí puedes agregar la lógica para cada pestaña (home, chats, user)
  }

  ngOnInit() {
    // Cargar los datos del usuario desde el servicio compartido
    this.user.name = this.userService.getName() || 'Nombre no disponible';
    this.user.degree = this.userService.getDegree() || 'Carrera no disponible';
    this.user.email = this.userService.getEmail() || 'Email no disponible';
    const userImage = this.userService.getImage();
    this.user.image = userImage && userImage !== 'null' ? userImage : 'assets/images/default.png';
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

  changeProfilePicture() {
    console.log('Cambiar foto de perfil');
    // Aquí puedes agregar la lógica para cambiar la foto de perfil
  }

  saveProfile() {
    console.log('Guardar cambios del perfil');
    // Aquí puedes agregar la lógica para guardar los cambios del perfil
  }
  mostrarDetallesTFG() {
    // Navegar a la página de detalles del TFG y pasar los datos del TFG
    this.router.navigateByUrl('/tfg-student'); 
  }

  salirAplicacion(){
    this.router.navigate(['/login']);
  }
}