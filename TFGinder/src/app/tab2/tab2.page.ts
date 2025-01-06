import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss']
})
export class Tab2Page implements OnInit {
  userId: string | null = null;
  chats: any[] = [];

  constructor(private chatService: ChatService, private authService: AuthService) {}

  async ngOnInit() {
    this.userId = await this.authService.getCurrentUserId();
    if (this.userId) {
      console.log('User ID obtenido:', this.userId);
      this.chatService.getChats(this.userId).subscribe(data => {
        console.log('Chats obtenidos:', data);
        this.chats = data;
      });
    } else {
      console.error('No se pudo obtener el ID del usuario');
      // Opcional: Redirige al usuario a la pantalla de inicio de sesión
    }
  }
}
