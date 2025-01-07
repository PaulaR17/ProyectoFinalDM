import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';



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

  fetchUserRole() {
    if (!this.userId) {
      console.error('El userId no está definido.');
      alert('No se encontró un usuario autenticado. Por favor, inicia sesión nuevamente.');
      return;
    }

    this.firestore
      .collection('users')
      .doc(this.userId)
      .get()
      .subscribe(
        (userDoc) => {
          if (userDoc.exists) {
            const userData = userDoc.data() as { role: string | undefined };
            this.userRole = userData?.role || null;

            console.log('Rol del usuario:', this.userRole);

            if (this.userRole === 'professor') {
              this.handleProfessorRole();
            } else if (this.userRole === 'student') {
              this.handleStudentRole();
            } else {
              console.warn('El rol del usuario no es válido o está vacío.');
              alert('No se pudo determinar el rol del usuario. Por favor, verifica tu cuenta.');
            }
          } else {
            console.error('No se encontró el documento del usuario.');
            alert('No se pudo cargar la información del usuario. Por favor, verifica tu cuenta.');
          }
        },
        (error) => {
          console.error('Error al obtener el rol del usuario:', error);
          alert('Hubo un error al cargar el rol del usuario. Intenta de nuevo más tarde.');
        }
      );
  }


  handleProfessorRole() {
    console.log('El usuario es un profesor.');
    this.fetchProfessorData();
  }

  handleStudentRole() {
    console.log('El usuario es un estudiante.');
    this.loadProfessorsFromFirebase();
  }


  interestedStudents: { id: string; name: string; requestedTfg?: string }[] = [];
  fetchProfessorData() {
    if (!this.userId) {
      console.error('El userId no está definido.');
      return;
    }

    this.firestore
      .collection('users')
      .doc(this.userId)
      .valueChanges({ idField: 'id' }) // Include the Firestore document ID
      .subscribe((data) => {
        if (data) {
          this.currentProfessor = data;
          console.log('Current professor data:', this.currentProfessor);
          const studentIds = this.currentProfessor?.['interesadosStudent'] || [];
          this.loadInterestedStudents(studentIds);
        } else {
          console.error('No se encontró información para el profesor.');
        }
      });
  }

  loadInterestedStudents(studentIds: string[]) {
    this.interestedStudents = []; // Reiniciar la lista de estudiantes

    studentIds.forEach(async (studentId) => {
      const studentData = await this.getStudentData(studentId); // Obtén los datos del estudiante

      // Obtener el TFG solicitado por el estudiante
      const requestedTfg = this.currentProfessor.tfg_professor.find(
        (tfgId: string) => studentData['pending_tfg']?.includes(tfgId)
      );

      // Agregar al estudiante con el TFG solicitado
      this.interestedStudents.push({
        id: studentId,
        name: studentData.name,
        requestedTfg: requestedTfg || null, // Asociar el TFG solicitado
      });
    });
  }


  async getStudentData(studentId: string): Promise<UserData> {
    try {
      const doc = await this.firestore.collection('users').doc(studentId).ref.get();
      if (doc.exists) {
        return doc.data() as UserData;
      }
    } catch (error) {
      console.error(`Error fetching data for student ${studentId}:`, error);
    }

    return { name: 'Desconocido', role: '', pending_tfg: [] }; // Retornar valores por defecto
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
async getStudentName(studentId: string): Promise<string> {
  if (this.studentNamesCache[studentId]) {
    return this.studentNamesCache[studentId];
  }

  try {
    const doc = await this.firestore.collection('users').doc(studentId).ref.get();
    if (doc.exists) {
      const studentData = doc.data() as UserData;
      const studentName = studentData.name || 'Desconocido';
      this.studentNamesCache[studentId] = studentName;
      return studentName;
    }
  } catch (error) {
    console.error(`Error fetching name for student ${studentId}:`, error);
  }

  this.studentNamesCache[studentId] = 'Desconocido';
  return 'Desconocido';
}



  // Función para cargar TFGs de profesores
  loadProfessorsFromFirebase() {
    this.firestore
      .collection('tfginder', (ref) => ref.where('Estado', '==', 'Libre'))
      .snapshotChanges()
      .subscribe((snapshot) => {
        this.professors = snapshot.map((doc) => {
          const data = doc.payload.doc.data() as { [key: string]: any };
          const id = doc.payload.doc.id;
          return { id, ...data }; // Incluye el campo `doc_numero`
        });

        console.log('TFGs cargados:', this.professors);
        console.log('currentProfessor?.tfg_professor:', this.currentProfessor?.tfg_professor);

        if (this.professors.length > 0) {
          this.currentProfessor = this.professors[this.currentProfessorIndex];
          console.log('Profesor actual cargado:', this.currentProfessor);
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

    const tfgId = this.currentProfessor?.id; // Usar el ID del documento Firestore
    if (!tfgId) {
      console.error('No se encontró el ID del TFG actual.');
      return;
    }

    try {
      const tfgDocRef = this.firestore.collection('tfginder').doc(tfgId);
      const userDocRef = this.firestore.collection('users').doc(this.userId);

      await this.firestore.firestore.runTransaction(async (transaction) => {
        const tfgDoc = await transaction.get(tfgDocRef.ref);
        if (!tfgDoc.exists) {
          throw new Error('El TFG no existe.');
        }

        const tfgData = tfgDoc.data() as {
          interesados?: number;
          interesadosStudent?: string[];
        };

        const userDoc = await transaction.get(userDocRef.ref);
        if (!userDoc.exists) {
          throw new Error('El usuario no existe.');
        }

        const userData = userDoc.data() as {
          pending_tfg?: string[];
        };

        // Validaciones y actualizaciones...
      });

      alert('¡Tu interés ha sido registrado correctamente!');
      this.showNextProfessor();
    } catch (error) {
      console.error('Error al registrar el interés:', error);
      alert('Ocurrió un problema al registrar tu interés. Intenta de nuevo.');
    }
  }

  async acceptStudent(professorId: string, studentId: string, tfgId: string) {
    if (!professorId || !studentId || !tfgId) {
      console.error('Parámetros incompletos en acceptStudent:', { professorId, studentId, tfgId });
      alert('No se puede aceptar al estudiante porque faltan datos.');
      return;
    }

    console.log('Datos en acceptStudent:', { professorId, studentId, tfgId });

    const professorDocRef = this.firestore.collection('users').doc(professorId);
    const studentDocRef = this.firestore.collection('users').doc(studentId);
    const tfgDocRef = this.firestore.collection('tfginder').doc(tfgId);

    try {
      await this.firestore.firestore.runTransaction(async (transaction) => {
        const tfgDoc = await transaction.get(tfgDocRef.ref);
        if (!tfgDoc.exists) {
          throw new Error(`El TFG con ID ${tfgId} no existe.`);
        }

        const professorDoc = await transaction.get(professorDocRef.ref);
        if (!professorDoc.exists) {
          throw new Error(`El profesor con ID ${professorId} no existe.`);
        }

        const studentDoc = await transaction.get(studentDocRef.ref);
        if (!studentDoc.exists) {
          throw new Error(`El estudiante con ID ${studentId} no existe.`);
        }

        const tfgData = tfgDoc.data() as { Estado?: string };
        if (tfgData.Estado !== 'Libre') {
          throw new Error('El TFG no está disponible para asignación.');
        }

        const professorData = professorDoc.data() as {
          interesadosStudent?: string[];
          acceptedStudents?: string[];
        };

        const interesadosStudent = professorData.interesadosStudent || [];
        const acceptedStudents = professorData.acceptedStudents || [];

        if (!interesadosStudent.includes(studentId)) {
          throw new Error('El estudiante no está en la lista de interesados.');
        }

        transaction.update(professorDocRef.ref, {
          interesadosStudent: interesadosStudent.filter((id) => id !== studentId),
          acceptedStudents: [...acceptedStudents, studentId],
        });

        transaction.update(studentDocRef.ref, {
          pending_tfg: [],
          pendingTFG: false,
          accepted_tfg: tfgId,
        });

        transaction.update(tfgDocRef.ref, {
          Estado: 'Asignado',
          Estudiante: studentId,
        });

        console.log(`Estudiante ${studentId} aceptado para el TFG ${tfgId}.`);
      });

      alert('¡Estudiante aceptado correctamente!');
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
      console.error('Error en acceptStudent:', errorMessage);
      alert(`Error al aceptar al estudiante: ${errorMessage}`);
    }
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

