import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  professor = {
    name: 'Dra. María López',
    status: 'En línea',
    imagen: 'ruta/a/la/imagen.jpg'
  };

  messages = [
    { tipo: 'received', text: '¡Hola! Me interesa tutorizar tu TFG sobre metodologías ágiles.', time: '12:30' },
    { tipo: 'sent', text: '¡Hola Dra. López! Muchas gracias por su interés. Me gustaría saber más sobre su experiencia en metodologías ágiles.', time: '12:32' },
    { tipo: 'received', text: 'He dirigido varios TFGs sobre Scrum y Kanban. También tengo experiencia práctica en empresas implementando estas metodologías.', time: '12:33' },
    { tipo: 'sent', text: '¡Genial! Me interesa especialmente Scrum. ¿Podríamos reunirnos para discutir posibles enfoques del trabajo?', time: '12:35' }
  ];

  newMessage = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('/tabs/tab2'); // O la ruta a la que quieras redirigir
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const now = new Date();
      const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      this.messages.push({ tipo: 'sent', text: this.newMessage, time: time });
      this.newMessage = '';
    }
  }
}