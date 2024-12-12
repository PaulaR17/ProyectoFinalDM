import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {
  user1 = {
    imagen: 'ruta/a/la/imagen1.jpg'
  };

  user2 = {
    name: 'Dr. Juan Martínez',
    especialidad: 'Inteligencia Artificial',
    imagen: 'ruta/a/la/imagen2.jpg'
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  goToChat() {
    this.router.navigateByUrl('/chat');
  }

  keepSearching() {
    this.router.navigateByUrl('/tabs/tab1');
  }
}