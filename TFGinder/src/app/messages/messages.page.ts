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
  currentUserId: string | null = 'zGIEZREWCrOecUYd6jfP9DbOJYg1'; // Simula el usuario actual (modifícalo según tu implementación)

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    // Captura el ID del chat desde la URL
    this.chatId = this.route.snapshot.paramMap.get('id');
    console.log('Chat ID:', this.chatId);

    // Obtén los mensajes si el ID del chat es válido
    if (this.chatId) {
      this.chatService.getMessages(this.chatId).subscribe(
        (data) => {
          console.log('Mensajes obtenidos:', data);
          this.messages = data; // Asigna los mensajes al array
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
    // Valida que el mensaje no esté vacío
    if (this.newMessage.trim() && this.chatId && this.currentUserId) {
      this.chatService.sendMessage(this.chatId, this.currentUserId, this.newMessage).then(
        () => {
          console.log('Mensaje enviado');
          this.newMessage = ''; // Limpia el campo de entrada
        },
        (error) => {
          console.error('Error al enviar mensaje:', error);
        }
      );
    }
  }
}
