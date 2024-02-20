import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private alertController: AlertController
  ) {}

  login() {
    // Llama al método de inicio de sesión del servicio de autenticación con las credenciales proporcionadas
    this.authService.login(this.email, this.password)
      .then(userCredential => {
        // Inicio de sesión exitoso, redirige a la página de inicio
        this.router.navigate(['/home']);
      })
      .catch(error => {
        // Error durante el inicio de sesión, muestra un mensaje de error
        this.presentAlert();
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Correo electrónico o contraseña incorrectos.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
