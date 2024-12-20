import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professor-info',
  templateUrl: './professor-info.page.html',
  styleUrls: ['./professor-info.page.scss'],
})
export class ProfessorInfoPage implements OnInit {
  professor = {
    name: 'Dr. Ana García',
    department: 'Departamento de Informática',
    imagen: 'assets/images/Ana.png',
    tfg: {
      title: 'Desarrollo de un Sistema de Recomendación basado en IA',
      description: 'Proyecto centrado en la implementación de un sistema de recomendación utilizando técnicas avanzadas de Machine Learning y Deep Learning. El objetivo es desarrollar un modelo capaz de realizar recomendaciones personalizadas basadas en el comportamiento del usuario y sus preferencias.'
    }
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('/tabs/tab1');
  }

  like() {
    console.log('Has mostrado interés en este TFG. Se notificará al profesor.');
    this.goBack();
  }

  reject() {
    console.log('Has descartado este TFG.');
    this.goBack();
  }
}