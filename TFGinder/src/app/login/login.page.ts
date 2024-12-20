import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };

  constructor(public router: Router) {}

  login() {
    console.log('Login attempt:', this.credentials);
    // Aquí realizarías la llamada a la API para autenticar al usuario

    // Si la autenticación es exitosa, redirige al usuario a la página principal
    this.router.navigateByUrl("/tabs")
  }
}