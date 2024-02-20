import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) { } // Agrega el Router al constructor

  ngOnInit() {
    
  }

  login(email: string, password: string) {
    this.authService.login(email, password)
      .then(userCredential => {
        // Inicio de sesión exitoso, redirigir al usuario a la página de inicio
        console.log('Inicio de sesión exitoso', userCredential.user);
        this.router.navigate(['/home']); // Redirigir a la página de inicio
      })
      .catch(error => {
        // Error durante el inicio de sesión, muestra un mensaje de error al usuario
        console.error('Error durante el inicio de sesión', error);
      });
  }
}
