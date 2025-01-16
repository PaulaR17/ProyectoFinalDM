import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private uid: string | null = null;
  private role: string | null = null;
  private name: string | null = null;
  private degree: string | null = null;
  private email: string | null = null;
  private image: string | null = null;

  constructor(private firestore: AngularFirestore) {}

  setUser(uid: string, rol: string, name: string, degree: string, email: string, image: string) {
    this.uid = uid;
    this.role = rol;
    this.name = name;
    this.degree = degree;
    this.email = email;
    this.image = image;
  }

  getUid(): string | null {
    return this.uid;
  }

  getRole(): string | null {
    return this.role;
  }

  getName(): string | null {
    return this.name;
  }

  getDegree(): string | null {
    return this.degree;
  }

  getEmail(): string | null {
    return this.email;
  }

  getImage(): string {
    return this.image && this.image !== 'null' ? this.image : 'assets/images/default.png';
  }

  async getUserTFGs(): Promise<any[]> {
    if (!this.uid) {
      console.error('Usuario no autenticado.');
      return [];
    }

    try {
      const userDoc: any = await this.firestore
        .collection('users')
        .doc(this.uid)
        .valueChanges()
        .pipe(first())
        .toPromise();

      console.log('Documento del usuario:', userDoc);

      if (!userDoc) {
        console.error('No se encontraron datos del usuario.');
        return [];
      }

      this.role = userDoc.rol || null; // Asignar el campo 'rol'

      if (this.role === 'student') {
        const acceptedTfgId: string = userDoc.accepted_tfg || userDoc.assignedTFG; // Incluir assignedTFG
        const pendingTfgIds: string[] = userDoc.pending_tfg || [];

        const tfgs: any[] = [];

        // TFG aceptado/asignado
        if (acceptedTfgId) {
          console.log('ID del TFG aceptado/asignado:', acceptedTfgId);
          const tfg = await this.getTFGById(acceptedTfgId);
          console.log('Datos del TFG:', tfg);

          if (tfg) {
            tfgs.push({ ...tfg, status: 'Aceptado' });
          }
        }



        // TFGs pendientes
        const pendingTFGs = await Promise.all(
          pendingTfgIds.map((tfgId) => this.getTFGById(tfgId).then((tfg) => tfg ? { ...tfg, status: 'Pendiente' } : null))
        );
        tfgs.push(...pendingTFGs.filter((tfg) => tfg));

        return tfgs;
      }

      if (this.role === 'professor') {
        const tfgProfessorIds: string[] = userDoc.tfg_professor || [];
        const tfgs = await Promise.all(
          tfgProfessorIds.map((tfgId) => this.getTFGById(tfgId).then((tfg) => tfg ? { ...tfg, status: tfg.estado } : null))
        );
        return tfgs.filter((tfg) => tfg);
      }

      console.error('Rol no válido.');
      return [];
    } catch (error) {
      console.error('Error al cargar los TFGs:', error);
      return [];
    }
  }



  private async getTFGById(tfgId: string): Promise<any> {
    console.log('Buscando TFG con ID:', tfgId);

    try {
      const tfgDoc: any = await this.firestore
        .collection('tfginder')
        .doc(tfgId)
        .valueChanges()
        .pipe(first())
        .toPromise();

      console.log('Datos del TFG encontrado:', tfgDoc);

      if (!tfgDoc) {
        console.error(`No se encontró el TFG con ID ${tfgId}`);
        return null;
      }

      return {
        id: tfgId,
        title: tfgDoc['Titulo del TFG'] || 'Título no disponible',
        professor: tfgDoc['Tutor/a'] || 'Tutor no asignado',
        student: tfgDoc['Estudiante'] || 'Estudiante no asignado',
        estado: tfgDoc['Estado'] || 'Estado no disponible',
      };
    } catch (error) {
      console.error(`Error al obtener el TFG con ID ${tfgId}:`, error);
      return null;
    }
  }

}
