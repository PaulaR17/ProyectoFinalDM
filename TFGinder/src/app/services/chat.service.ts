import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener chats del usuario
  getChats(userId: string): Observable<any[]> {
    return this.firestore.collection('Chats', ref =>
      ref.where('participants', 'array-contains', userId)
    ).valueChanges({ idField: 'id' });
  }

  // Obtener mensajes de un chat
  getMessages(chatId: string): Observable<any[]> {
    return this.firestore.collection(`Chats/${chatId}/messages`, ref =>
      ref.orderBy('timestamp')
    ).valueChanges();
  }

  // Enviar un mensaje
  sendMessage(chatId: string, senderId: string, text: string) {
    const timestamp = new Date().toISOString();
    return this.firestore.collection(`Chats/${chatId}/messages`).add({
      senderId,
      text,
      timestamp
    });
  }
}
