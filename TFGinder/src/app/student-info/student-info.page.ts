import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.page.html',
  styleUrls: ['./student-info.page.scss'],
})
export class StudentInfoPage implements OnInit {
  student = {
    name: 'Carlos Rodríguez',
    imagen: 'ruta/a/la/imagen.jpg',
    tfg: {
      title: 'Sistema de Recomendación basado en IA para Tutores de TFG',
      description: 'Desarrollo de una plataforma innovadora que utiliza algoritmos de inteligencia artificial para emparejar estudiantes con tutores de TFG basándose en sus intereses académicos, experiencia previa y áreas de investigación. El sistema incluirá análisis de compatibilidad y recomendaciones personalizadas para optimizar el proceso de selección de tutor.'
    }
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('/tabs/tab1'); // O la ruta a la que quieras redirigir
  }

  like() {
    console.log('Has mostrado interés en este estudiante. Se le notificará y podrá revisar tu perfil.');
    setTimeout(() => {
      this.goBack();
    }, 1500);
  }

  reject() {
    console.log('Has rechazado este perfil.');
    setTimeout(() => {
      this.goBack();
    }, 1500);
  }
}