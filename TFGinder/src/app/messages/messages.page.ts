import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  chatId: string | null = null; // ID del chat actual
  messages: any[] = []; // Array para los mensajes
  newMessage = ''; // Texto del nuevo mensaje
  currentUserId: string | null = 'zGIEZREWCrOecUYd6jfP9DbOJYg1'; // ID del usuario actual
  currentUserName: string | null = 'David Martínez'; // Nombre del usuario actual (modifícalo según tu implementación)

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id');
    if (this.chatId) {
      this.chatService.getMessages(this.chatId).subscribe(
        (data) => {
          console.log('Mensajes obtenidos:', data);
          this.messages = data; // Mensajes ahora incluyen `senderName`
        },
        (error) => {
          console.error('Error al obtener mensajes:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID del chat');
    }
  }
  

  sendMessage() {
    if (
      this.newMessage.trim() &&
      this.chatId &&
      this.currentUserId &&
      this.currentUserName
    ) {
      this.chatService
        .sendMessage(
          this.chatId,
          this.currentUserId,
          this.currentUserName, // Pasa el nombre del usuario
          this.newMessage
        )
        .then(() => {
          console.log('Mensaje enviado');
          this.newMessage = ''; // Limpia el campo de entrada
        })
        .catch((error) => {
          console.error('Error al enviar mensaje:', error);
        });
    }
  }
  
}
