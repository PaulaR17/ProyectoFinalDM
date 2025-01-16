import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-professor-info',
  templateUrl: './professor-info.page.html',
  styleUrls: ['./professor-info.page.scss'],
})
export class ProfessorInfoPage implements OnInit {
  professor: any = null; // Aquí se almacenarán los datos del profesor

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore // Firebase Firestore
  ) {}

  ngOnInit() {
    // Obtener el ID del profesor desde la URL
    const professorId = this.route.snapshot.paramMap.get('id');

    if (professorId) {
      // Consultar Firebase para cargar los datos del profesor
      this.firestore
        .collection('tfginder') // Cambia por el nombre de tu colección
        .doc(professorId)
        .valueChanges()
        .subscribe(
          (data) => {
            if (data) {
              this.professor = data; // Almacenar los datos del profesor
            } else {
              console.error('No se encontraron datos para este profesor.');
            }
          },
          (error) => {
            console.error('Error al cargar los datos del profesor:', error);
          }
        );
    } else {
      console.error('No se proporcionó un ID de profesor.');
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']); // Regresar a la página principal
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
