import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tfg-student',
  templateUrl: './tfg-student.page.html',
  styleUrls: ['./tfg-student.page.scss'],
})
export class TFGStudentPage implements OnInit {
  tfg = {
    title: 'Sistema de IA para Detección de Fraude',
    status: 'En Curso',
    student: 'María López',
    tutor: 'Dr. Antonio García',
    description: 'Desarrollo de un sistema de detección de fraude basado en inteligencia artificial, utilizando técnicas de machine learning y análisis de patrones para identificar transacciones sospechosas en tiempo real.',
    calificacion: 8.5, // Puedes cambiar esto o dejarlo como null si no hay calificación aún
    notas: 'Buen progreso en el desarrollo del sistema. Se recomienda profundizar en la validación del modelo.' // Puedes cambiar esto o dejarlo como null si no hay notas aún
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('/student-profile'); // O la ruta a la que quieras redirigir
  }
}