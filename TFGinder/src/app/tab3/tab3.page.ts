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

  constructor(
    private alertController: AlertController,
    private router: Router,
    public userService: UserService
  ) {}

  // Este método solo se ejecuta una vez, al inicializar el componente
  async ngOnInit() {
    await this.loadUserData();
    await this.loadTFGs();
  }

  // Este método se ejecuta cada vez que se entra en la vista
  async ionViewWillEnter() {
    await this.loadUserData(); // Asegúrate de cargar los datos del usuario actual
    await this.loadTFGs(); // Recarga los TFGs para reflejar cambios
  }

  // Carga los datos del usuario desde el servicio
  private async loadUserData() {
    this.user.name = this.userService.getName() || 'Nombre no disponible';
    this.user.degree = this.userService.getDegree() || 'Carrera no disponible';
    this.user.email = this.userService.getEmail() || 'Email no disponible';
    this.user.image = this.userService.getImage();
  }

  // Carga los TFGs asociados al usuario desde el servicio
  private async loadTFGs() {
    try {
      this.tfgs = await this.userService.getUserTFGs();
    } catch (error) {
      console.error('Error al cargar los TFGs:', error);
    }
  }

  // Navega a los detalles del TFG seleccionado
  mostrarDetallesTFG(tfg: any) {
    console.log('Navegando con tfgId:', tfg.id);
    if (this.userService.getRole() === 'student') {
      this.router.navigate(['/tfg-student'], { state: { tfgId: tfg.id } });
    } else {
      this.router.navigate(['/tfg-professor'], { state: { tfgId: tfg.id } });
    }
  }

  // Cierra sesión y redirige al login
  salirAplicacion() {
    this.router.navigate(['/login']);
  }

  // Muestra un mensaje de configuración (puedes personalizarlo)
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración',
      message: 'Aquí puedes gestionar la configuración del perfil.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
