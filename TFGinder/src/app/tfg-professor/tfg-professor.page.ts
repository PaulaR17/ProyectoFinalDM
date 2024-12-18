import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tfg-professor',
  templateUrl: './tfg-professor.page.html',
  styleUrls: ['./tfg-professor.page.scss'],
})
export class TFGProfessorPage implements OnInit {
  tfg = {
    title: 'Sistema de IA para Detección de Fraude',
    status: 'En Curso',
    student: 'María López',
    tutor: 'Dr. Antonio García',
    description: 'Desarrollo de un sistema de detección de fraude basado en inteligencia artificial, utilizando técnicas de machine learning y análisis de patrones para identificar transacciones sospechosas en tiempo real.',
    calificacion: null,
    notas: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('/professor-profile'); // O la ruta a la que quieras redirigir
  }

  saveChanges() {
    console.log('Cambios guardados:', this.tfg);
    // Aquí iría la lógica para guardar los cambios en la base de datos o API
    alert('Cambios guardados correctamente');
  }
}