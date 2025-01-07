import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';

interface TFGDocument {
  'Titulo del TFG'?: string;
  Estado?: string;
  Estudiante?: string;
  'Tutor/a'?: string;
  Descripcion?: string;
  Nota?: number | null;
}

@Component({
  selector: 'app-tfg-student',
  templateUrl: './tfg-student.page.html',
  styleUrls: ['./tfg-student.page.scss'],
})
export class TFGStudentPage implements OnInit {
  tfg: any = null; // Aquí se almacenarán los datos del TFG
  tfgId: string | null = null; // ID del TFG que se va a cargar

  constructor(private router: Router, private firestore: AngularFirestore) {}

  async ngOnInit() {
    // Obtener el ID del TFG desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.tfgId = navigation.extras.state['tfgId'];
      console.log('ID del TFG recibido:', this.tfgId); // Verifica si el ID se imprime correctamente
    }
  
    if (this.tfgId) {
      // Intentar cargar los datos del TFG desde Firestore
      try {
        const tfgDoc = (await this.firestore
          .collection('tfginder')
          .doc<TFGDocument>(this.tfgId)
          .valueChanges()
          .pipe(first())
          .toPromise()) as TFGDocument | null;
  
        console.log('Datos del TFG recibido:', tfgDoc); // Verifica los datos recibidos
        if (tfgDoc) {
          this.tfg = {
            title: tfgDoc['Titulo del TFG'] || 'Título no disponible',
            estado: tfgDoc.Estado || 'No disponible',
            estudiante: tfgDoc.Estudiante || 'No asignado',
            tutor: tfgDoc['Tutor/a'] || 'No asignado',
            descripcion: tfgDoc.Descripcion || 'No disponible',
            nota: tfgDoc.Nota || null,
          };
        } else {
          console.error(`No se encontraron datos para el TFG con ID ${this.tfgId}`);
        }
      } catch (error) {
        console.error('Error al cargar el TFG:', error);
      }
    } else {
      console.error('No se recibió ningún ID de TFG.');
    }
  }

  goBack() {
    this.router.navigateByUrl('/tabs/tab3'); // Volver a la página anterior
  }
}
