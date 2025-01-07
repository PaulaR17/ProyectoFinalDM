import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener mensajes de un chat y mapear senderName
  getMessages(chatId: string): Observable<any[]> {
    return this.firestore
      .collection(`Chats/${chatId}/messages`, (ref) => ref.orderBy('timestamp'))
      .valueChanges()
      .pipe(
        switchMap((messages: any[]) => {
          if (messages.length === 0) return of([]);
          const userIds = [...new Set(messages.map((msg) => msg.senderId))];
          const userObservables = userIds.map((uid) =>
            this.firestore
              .doc(`users/${uid}`)
              .valueChanges()
              .pipe(
                map((user: any) => ({ uid, name: user?.name || 'Usuario desconocido' }))
              )
          );
          return combineLatest(userObservables).pipe(
            map((users: any[]) => {
              const userMap: { [key: string]: string } = users.reduce((acc, user) => {
                acc[user.uid] = user.name; // Mapea el ID del documento al campo 'name'
                return acc;
              }, {});
              return messages.map((msg) => ({
                ...msg,
                senderName: userMap[msg.senderId] || 'Usuario desconocido',
              }));
            })
          );
        })
      );
  }
  

  // Enviar mensaje
  sendMessage(chatId: string, senderId: string, senderName: string, text: string) {
    if (!chatId || !senderId || !senderName || !text.trim()) {
      return Promise.reject('Todos los campos son obligatorios.');
    }
    const timestamp = new Date().toISOString();
    return this.firestore.collection(`Chats/${chatId}/messages`).add({
      senderId,
      senderName,
      text,
      timestamp,
    });
  }
  // Obtener chats en los que participa el usuario
getChats(userId: string): Observable<any[]> {
  return this.firestore.collection('Chats', (ref) =>
    ref.where('participants', 'array-contains', userId) // Filtrar chats por el usuario participante
  ).valueChanges({ idField: 'id' }); // Incluir el ID del documento como 'id'
}

}
