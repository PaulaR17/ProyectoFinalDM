import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { arrayUnion, arrayRemove } from 'firebase/firestore';

// Interfaz para datos de TFG
interface TfgData {
  interesados: string[]; // Lista de IDs de estudiantes interesados
  acceptedStudents?: string[]; // Lista de IDs de estudiantes aceptados
  'Tutor/a': string; // Definir explícitamente el tipo de 'Tutor/a' como string

  [key: string]: any; // Para manejar otros campos dinámicos
}
interface UserData {
  name: string;
  role: string;
  [key: string]: any; // Para permitir otros campos dinámicos si es necesario
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  professors: any[] = []; // Lista de profesores y sus TFGs
  currentProfessorIndex = 0; // Índice del profesor actual
  currentProfessor: any = null; // Información del profesor actual
  userId: string | null = null; // ID del usuario autenticado
  userRole: string | null = null; // Rol del usuario autenticado ('student' o 'professor')

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar autenticación y cargar datos iniciales
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.log('Usuario autenticado con UID:', this.userId);
        this.fetchUserRole();
        this.loadProfessorsFromFirebase();
      } else {
        console.error('No se encontró el usuario autenticado.');
        this.router.navigate(['/login']);
      }
    });
  }
  
  
  // Función para obtener el rol del usuario
fetchUserRole() {
  if (!this.userId) {
    console.error('El userId no está definido.');
    return;
  }



  this.firestore
    .collection('users')
    .doc(this.userId)
    .get()
    .subscribe(
      (userDoc) => {
        if (userDoc.exists) {
          const userData = userDoc.data() as { role: string } | undefined; // Aseguramos el tipo
          this.userRole = userData?.role || null;
          console.log('Rol del usuario:', this.userRole);
        } else {
          console.error('No se encontró el documento del usuario.');
          alert('No se pudo cargar la información del usuario.');
        }
      },
      (error) => console.error('Error al obtener el rol del usuario:', error)
    );
}
// Función para agregar un usuario a Firestore
async addUser(uid: string, name: string, role: string) {
  if (!uid || !name || !role) {
    console.error('Datos incompletos para agregar al usuario.');
    alert('Faltan datos para registrar al usuario.');
    return;
  }

  try {
    await this.firestore.collection('users').doc(uid).set({
      name: name,
      role: role,
      pendingTFG: role === 'student' ? null : undefined,
      interesados: role === 'professor' ? [] : undefined,
      acceptedStudents: role === 'professor' ? [] : undefined,
    });
    console.log(`Usuario con UID ${uid} agregado correctamente.`);
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    alert('Hubo un error al registrar al usuario. Intenta de nuevo.');
  }
}
studentNamesCache: { [id: string]: string } = {};
  getStudentName(studentId: string): string {
    // Si el nombre ya está en caché, devolverlo directamente
    if (this.studentNamesCache[studentId]) {
      return this.studentNamesCache[studentId];
    }
  
    // Si no está en caché, consultar Firestore
    this.firestore
      .collection('users')
      .doc(studentId)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          const studentData = doc.data() as UserData; // Especificar el tipo de los datos
          const studentName = studentData.name || 'Desconocido'; // Ahora TypeScript reconoce name
          this.studentNamesCache[studentId] = studentName; // Almacenar en caché
        } else {
          
          this.studentNamesCache[studentId] = 'Desconocido'; // Valor por defecto si no existe
        }
      });
  
    // Mientras se carga el nombre, devolver un valor temporal
    return 'Cargando...';
  }
  // Función para cargar TFGs de profesores
  loadProfessorsFromFirebase() {
    this.firestore
      .collection('tfginder')
      .valueChanges({ idField: 'id' })
      .subscribe((data: any[]) => {
        this.professors = data;
        if (this.professors.length > 0) {
          this.currentProfessor = this.professors[this.currentProfessorIndex];
        } else {
          console.log('No se encontraron TFGs disponibles.');
        }
      });
  }

  // Mostrar siguiente profesor
  showNextProfessor() {
    this.currentProfessorIndex++;
    if (this.currentProfessorIndex >= this.professors.length) {
      this.currentProfessorIndex = 0;
    }
    this.currentProfessor = this.professors[this.currentProfessorIndex];
  }

  
  async like() {
    if (!this.userId) {
      console.error('El userId no está definido.');
      alert('No se pudo obtener el ID del usuario.');
      return;
    }
  
    const tfgId = this.currentProfessor?.id;
    if (!tfgId) {
      console.error('No se encontró el ID del TFG actual.');
      return;
    }
  
    try {
      // Obtener el documento del usuario
      const userDocRef = this.firestore.collection('users').doc(this.userId);
      const userDocSnapshot = await userDocRef.get().toPromise();
  
      if (!userDocSnapshot || !userDocSnapshot.exists) {
        console.error('No se encontró el documento del usuario.');
        alert('No se pudo encontrar tu información de usuario.');
        return;
      }
  
      const userData = userDocSnapshot.data() as { pendingTFG?: string };
  
      // Verificar si el usuario ya tiene un TFG pendiente
      if (userData.pendingTFG) {
        console.log('Ya tienes un TFG pendiente.');
        alert('No puedes seleccionar otro TFG hasta que el actual sea aceptado o rechazado.');
        return;
      }
  
      // Obtener el documento del TFG actual
      const tfgDocRef = this.firestore.collection('tfginder').doc(tfgId);
      const tfgDocSnapshot = await tfgDocRef.get().toPromise();
  
      if (!tfgDocSnapshot || !tfgDocSnapshot.exists) {
        console.error('No se encontró el documento del TFG.');
        alert('No se pudo encontrar la información del TFG.');
        return;
      }
  
      // Obtener datos actuales del TFG y actualizar el contador de interesados
      const tfgData = tfgDocSnapshot.data() as { 
        interesados?: string; 
        interesadosStudent?: string[]; 
        "Tutor/a"?: string 
      };
  
      let currentInteresados = parseFloat(tfgData.interesados || '0.0');
      const newInteresados = (currentInteresados + 1.0).toFixed(1);
  
      const updatedInteresadosStudent = tfgData.interesadosStudent || [];
      if (!updatedInteresadosStudent.includes(this.userId)) {
        updatedInteresadosStudent.push(this.userId);
      }
  
      // Actualizar el campo `interesados` y `interesadosStudent` en el documento del TFG
      await tfgDocRef.update({
        interesados: newInteresados,
        interesadosStudent: updatedInteresadosStudent,
      });
  
      console.log('Interés registrado correctamente en el TFG.');
  
      // Buscar el documento del profesor asociado
      const professorName = tfgData["Tutor/a"];
      if (!professorName) {
        console.error('El campo "Tutor/a" no existe en el documento del TFG.');
        alert('No se pudo encontrar el profesor asociado al TFG.');
        return;
      }
  
      const professorQuerySnapshot = await this.firestore
        .collection('users')
        .ref.where('name', '==', professorName)
        .get();
  
      if (professorQuerySnapshot.empty) {
        console.error('No se encontró el documento del profesor.');
        alert('No se pudo encontrar la información del profesor.');
        return;
      }
  
      const professorDoc = professorQuerySnapshot.docs[0];
      const professorId = professorDoc.id;
  
      // Agregar el estudiante a la lista de interesados en el documento del profesor
      const professorData = professorDoc.data() as { interesadosStudent?: string[] };
      const professorInteresadosStudent = professorData.interesadosStudent || [];
      if (!professorInteresadosStudent.includes(this.userId)) {
        professorInteresadosStudent.push(this.userId);
      }
  
      await this.firestore.collection('users').doc(professorId).update({
        interesadosStudent: professorInteresadosStudent,
      });
  
      console.log('Estudiante agregado a la lista de interesados del profesor.');
  
      // Actualizar el estado del usuario
      await userDocRef.update({
        pendingTFG: tfgId, // Marcar el TFG como pendiente
      });
  
      alert('¡Tu interés ha sido registrado correctamente!');
      this.showNextProfessor(); // Mostrar el siguiente profesor
    } catch (error) {
      console.error('Error al registrar el interés:', error);
      alert('Ocurrió un problema al registrar tu interés. Intenta de nuevo.');
    }
  }
  
  
  
  async acceptStudent(professorId: string, studentId: string) {
    const professorDocRef = this.firestore.collection('users').doc(professorId);
    const userDocRef = this.firestore.collection('users').doc(studentId);
  
    await this.firestore.firestore.runTransaction(async (transaction) => {
      const professorDoc = await transaction.get(professorDocRef.ref);
      if (!professorDoc.exists) throw new Error('El profesor no existe.');
  
      const professorData = professorDoc.data() as { interesadosStudent?: string[]; acceptedStudents?: string[] };
      const interesadosStudent = professorData.interesadosStudent || [];
      const acceptedStudents = professorData.acceptedStudents || [];
  
      if (!interesadosStudent.includes(studentId)) {
        throw new Error('El estudiante no está en la lista de interesados.');
      }
  
      transaction.update(professorDocRef.ref, {
        interesadosStudent: interesadosStudent.filter((id) => id !== studentId),
        acceptedStudents: [...acceptedStudents, studentId],
      });
  
      transaction.update(userDocRef.ref, {
        pendingTFG: null, // Marcar como aceptado
      });
  
      console.log(`Estudiante ${studentId} aceptado.`);
    });
  }
  async rejectStudent(professorId: string, studentId: string) {
    const professorDocRef = this.firestore.collection('users').doc(professorId);
    const userDocRef = this.firestore.collection('users').doc(studentId);
  
    await this.firestore.firestore.runTransaction(async (transaction) => {
      const professorDoc = await transaction.get(professorDocRef.ref);
      if (!professorDoc.exists) throw new Error('El profesor no existe.');
  
      const professorData = professorDoc.data() as { interesadosStudent?: string[] };
      const interesadosStudent = professorData.interesadosStudent || [];
  
      if (!interesadosStudent.includes(studentId)) {
        throw new Error('El estudiante no está en la lista de interesados.');
      }
  
      transaction.update(professorDocRef.ref, {
        interesadosStudent: interesadosStudent.filter((id) => id !== studentId),
      });
  
      transaction.update(userDocRef.ref, {
        pendingTFG: null, // Marcar como rechazado
      });
  
      console.log(`Estudiante ${studentId} rechazado.`);
    });
  }
  
      
  // Función para rechazar un TFG (nope)
  nope() {
    const card = document.getElementById('currentCard');
    card?.classList.add('nope-animation');


    setTimeout(() => {
      card?.classList.remove('nope-animation');
      this.showNextProfessor();
    }, 500);
  }


  // Función para mostrar detalles del profesor
  mostrarDetallesProfesor() {
    this.router.navigate(['/professor-info']);
  }
}


