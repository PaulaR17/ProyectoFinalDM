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

interface InterestedStudent {
  id: string; // ID del estudiante
  name: string; // Nombre del estudiante
  requestedTfg?: string; // ID del TFG solicitado (opcional)
  tfgId?: string; // ID del TFG asociado
  tfgTitle?: string; // Título del TFG asociado
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
            // Verificar ambos campos: 'role' y 'rol'
            const userData = userDoc.data() as { role?: string; rol?: string };
            this.userRole = userData?.role || userData?.rol || null;

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


  interestedStudents: InterestedStudent[] = [];
  fetchProfessorData() {
    if (!this.userId) {
      console.error('El userId no está definido.');
      return;
    }

    this.firestore
      .collection('users')
      .doc(this.userId)
      .valueChanges({ idField: 'id' }) // Incluye el ID del documento
      .subscribe((data) => {
        if (data) {
          this.currentProfessor = data;

          // Asegurar que tfg_professor es un array
          if (!Array.isArray(this.currentProfessor?.tfg_professor)) {
            this.currentProfessor.tfg_professor = [];
          }

          console.log('Datos del profesor actual:', this.currentProfessor);

          const studentIds = this.currentProfessor?.['interesadosStudent'] || [];
          this.loadInterestedStudents(studentIds);
        } else {
          console.error('No se encontró información para el profesor.');
        }
      });
  }



  async loadInterestedStudents(studentIds: string[]) {
    this.interestedStudents = []; // Reiniciar la lista de estudiantes

    for (const studentId of studentIds) {
      const studentData = await this.getStudentData(studentId); // Obtener datos del estudiante

      // Obtener el TFG solicitado por el estudiante
      const requestedTfgId = this.currentProfessor.tfg_professor.find(
        (tfgId: string) => studentData['pending_tfg']?.includes(tfgId)
      );

      let tfgTitle = 'No especificado';
      if (requestedTfgId) {
        const tfgData = await this.getTFGData(requestedTfgId);
        tfgTitle = tfgData?.['Titulo del TFG'] || 'No especificado';
      }

      // Añadir el estudiante a la lista con todos los datos necesarios
      this.interestedStudents.push({
        id: studentId,
        name: studentData.name,
        tfgId: requestedTfgId || null,
        tfgTitle: tfgTitle,
      });
    }
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

  async getTFGData(tfgId: string): Promise<any> {
    try {
      const doc = await this.firestore.collection('tfginder').doc(tfgId).ref.get();
      if (doc.exists) {
        return doc.data();
      }
    } catch (error) {
      console.error(`Error fetching data for TFG ${tfgId}:`, error);
    }
    return null;
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

    const tfgId = this.currentProfessor?.id;
    if (!tfgId) {
      console.error('No se encontró el ID del TFG actual.');
      return;
    }

    try {
      const tfgDocRef = this.firestore.collection('tfginder').doc(tfgId);
      const userDocRef = this.firestore.collection('users').doc(this.userId);

      await this.firestore.firestore.runTransaction(async (transaction) => {
        // **Read all documents at the beginning**
        const tfgDoc = await transaction.get(tfgDocRef.ref);
        if (!tfgDoc.exists) {
          throw new Error('El TFG no existe.');
        }

        const tfgData = tfgDoc.data() as {
          interesados?: number;
          interesadosStudent?: string[];
          "Tutor/a"?: string;
        };

        const userDoc = await transaction.get(userDocRef.ref);
        if (!userDoc.exists) {
          throw new Error('El usuario no existe.');
        }

        const userData = userDoc.data() as {
          pending_tfg?: string[];
          pendingTFG?: boolean;
        };

        const professorName = tfgData["Tutor/a"];
        if (!professorName || typeof professorName !== 'string' || professorName.trim() === '') {
          throw new Error('El campo Tutor/a está vacío o no es válido.');
        }

        const professorQuerySnapshot = await this.firestore
          .collection('users')
          .ref.where('name', '==', professorName.trim())
          .get();

        if (professorQuerySnapshot.empty) {
          console.error(`No se encontró ningún profesor con el nombre: "${professorName.trim()}"`);
          throw new Error('No se encontró al profesor asociado.');
        }

        const professorDoc = professorQuerySnapshot.docs[0];
        const professorId = professorDoc.id;
        const professorDocRef = this.firestore.collection('users').doc(professorId);

        const professorData = professorDoc.data() as {
          interesadosStudent?: string[];
        };

        // **Perform all updates after reads**
        const currentInteresados = tfgData.interesados || 0;
        const updatedInteresados = currentInteresados + 1;

        const interesadosStudent = tfgData.interesadosStudent || [];
        if (!this.userId) {
          throw new Error('El userId no está definido.');
        }
        if (interesadosStudent.includes(this.userId)) {
          throw new Error('Ya has mostrado interés en este TFG.');
        }

        // Add userId to interesadosStudent in TFG
        interesadosStudent.push(this.userId);

        // Update TFG document
        transaction.update(tfgDocRef.ref, {
          interesados: updatedInteresados,
          interesadosStudent: interesadosStudent,
        });

        console.log('TFG actualizado con nuevos interesados:', updatedInteresados);

        // Update user's pending_tfg array and pendingTFG boolean
        const pendingTfgs = userData.pending_tfg || [];
        if (pendingTfgs.includes(tfgId)) {
          throw new Error('Este TFG ya está en tu lista de pendientes.');
        }
        pendingTfgs.push(tfgId);

        transaction.update(userDocRef.ref, {
          pending_tfg: pendingTfgs,
          pendingTFG: pendingTfgs.length > 0, // Set to true if there are TFGs in the array
        });

        console.log(
          `Usuario ${this.userId} actualizado con pending_tfg:`,
          pendingTfgs
        );

        // Update professor's interesadosStudent array
        const professorInteresadosStudent = professorData.interesadosStudent || [];
        if (!professorInteresadosStudent.includes(this.userId)) {
          professorInteresadosStudent.push(this.userId);
        }

        transaction.update(professorDocRef.ref, {
          interesadosStudent: professorInteresadosStudent,
        });

        console.log(
          `Profesor ${professorId} actualizado con nuevos interesados:`,
          professorInteresadosStudent
        );
      });

      alert('¡Tu interés ha sido registrado correctamente!');
      this.showNextProfessor();
    } catch (error) {
      console.error('Error al registrar el interés:', error);
      alert('Ocurrió un problema al registrar tu interés. Intenta de nuevo.');
    }
  }



  async rejectStudent(studentId: string, tfgId: string): Promise<void> {
    if (!tfgId) {
      alert('No se pudo determinar el TFG asociado.');
      return;
    }
    await this.handleStudentAction(studentId, tfgId, 'reject');
  }

  async acceptStudent(studentId: string, tfgId: string): Promise<void> {
    if (!tfgId) {
      alert('No se pudo determinar el TFG asociado.');
      return;
    }
    await this.handleStudentAction(studentId, tfgId, 'accept');
  }



  private async handleStudentAction(studentId: string, tfgId: string, action: 'accept' | 'reject'): Promise<void> {
    const tfgDocRef = this.firestore.collection('tfginder').doc(tfgId);
    const professorDocRef = this.firestore.collection('users').doc(this.currentProfessor.id);
    const studentDocRef = this.firestore.collection('users').doc(studentId);

    try {
      await this.firestore.firestore.runTransaction(async (transaction) => {
        const tfgDoc = await transaction.get(tfgDocRef.ref);
        if (!tfgDoc.exists) throw new Error('El TFG no existe.');

        const professorDoc = await transaction.get(professorDocRef.ref);
        if (!professorDoc.exists) throw new Error('El profesor no existe.');

        const studentDoc = await transaction.get(studentDocRef.ref);
        if (!studentDoc.exists) throw new Error('El estudiante no existe.');

        const professorData = professorDoc.data() as TfgData;
        const interesadosStudent = professorData['interesadosStudent'] || [];
        const acceptedStudents = professorData['acceptedStudents'] || [];

        const updatedInteresados = interesadosStudent.filter((id: string) => id !== studentId);

        if (action === 'accept') {
          acceptedStudents.push(studentId);

          transaction.update(professorDocRef.ref, {
            interesadosStudent: updatedInteresados,
            acceptedStudents: acceptedStudents,
          });

          transaction.update(studentDocRef.ref, {
            assignedTFG: tfgId,
            pendingTFG: false,
            pending_tfg: [],
          });

          transaction.update(tfgDocRef.ref, {
            Estado: 'Asignado',
            Estudiante: studentId,
          });

          alert('¡Estudiante aceptado y TFG asignado correctamente!');
        } else {
          transaction.update(professorDocRef.ref, {
            interesadosStudent: updatedInteresados,
          });
          alert('¡Estudiante rechazado correctamente!');
        }
      });
    } catch (error) {
      console.error(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} al estudiante:`, error);
      alert(`Ocurrió un error al ${action === 'accept' ? 'aceptar' : 'rechazar'} al estudiante.`);
    }
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


  mostrarDetallesProfesor() {
    if (this.currentProfessor && this.currentProfessor.id) {
      this.router.navigate(['/professor-info', this.currentProfessor.id]);
    } else {
      console.error('No hay un currentProfessor válido para mostrar.');
    }
  }



}

