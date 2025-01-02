import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  //obtener todos los documentos de una colección
  getDocuments(collection: string) {
    return this.firestore.collection(collection).valueChanges();
  }

  //obtener un documento específico por ID
  getDocumentById(collection: string, id: string) {
    return this.firestore.collection(collection).doc(id).valueChanges();
  }
}
