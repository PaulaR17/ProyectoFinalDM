import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  chatId: string | null = null; // ID del chat actual
  messages: any[] = []; // Array para los mensajes
  newMessage = ''; // Texto del nuevo mensaje
  currentUserId: string | null = null; // ID del usuario actual
  currentUserName: string | null = null; // Nombre del usuario actual

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService // Agregamos AuthService
  ) {}

  ngOnInit() {
    // Obtener el ID del chat desde la URL
    this.chatId = this.route.snapshot.paramMap.get('id');
    if (!this.chatId) {
      console.error('No se pudo obtener el ID del chat');
      return;
    }

    // Obtener el usuario loggeado
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.currentUserId = user.uid; // ID del usuario actual
          this.currentUserName = user.displayName || 'Usuario desconocido'; // Nombre del usuario actual
          console.log('Usuario loggeado:', {
            id: this.currentUserId,
            name: this.currentUserName,
          });

          // Cargar los mensajes del chat
          this.loadMessages();
        } else {
          console.error('No hay usuario loggeado');
        }
      },
      (error) => {
        console.error('Error al obtener el usuario loggeado:', error);
      }
    );
  }

  // Cargar mensajes del chat
  loadMessages() {
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
    }
  }

  // Enviar mensaje
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
