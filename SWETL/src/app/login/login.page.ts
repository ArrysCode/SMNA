import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) {}

  async login() {
    try {
      const userDoc = await this.firestore.collection('usuarios', ref => ref.where('correo', '==', this.email).where('contraseña', '==', this.password)).get().toPromise();
      if (userDoc && !userDoc.empty) {
        // Usuario encontrado, redirigir a la página de inicio
        this.router.navigate(['/home']);
      } else {
        // Usuario no encontrado o credenciales incorrectas
        this.presentAlert('Correo electrónico o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al verificar credenciales en Firestore', error);
      this.presentAlert('Error al iniciar sesión.');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
