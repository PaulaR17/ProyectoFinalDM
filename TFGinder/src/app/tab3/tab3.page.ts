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

  tfgs: any[] = []; // Aquí se guardan los TFGs del usuario
  currentSegment = 'user';

  constructor(
    private alertController: AlertController,
    private router: Router,
    public userService: UserService
  ) {}

  async ngOnInit() {
    this.user.name = this.userService.getName() || 'Nombre no disponible';
    this.user.degree = this.userService.getDegree() || 'Carrera no disponible';
    this.user.email = this.userService.getEmail() || 'Email no disponible';
    this.user.image = this.userService.getImage();

    try {
      this.tfgs = await this.userService.getUserTFGs();
    } catch (error) {
      console.error('Error al cargar los TFGs:', error);
    }
  }

  mostrarDetallesTFG(tfg: any) {
    // Redirige según el rol
    if (this.userService.getRole() === 'student') {
      this.router.navigate(['/tfg-student'], { state: { tfgId: tfg.id } });
    } else {
      this.router.navigate(['/tfg-professor'], { state: { tfgId: tfg.id } });
    }
  }

  salirAplicacion(){
    this.router.navigate(['/login']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración',
      message: 'Aquí puedes gestionar la configuración del perfil.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
