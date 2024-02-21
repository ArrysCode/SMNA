import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../interfaces/usuarios.interface';
import { getAuth, deleteUser } from 'firebase/auth';
// Ajusta la ruta según tu estructura de archivos

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  roles: string[] = ['user', 'admin'];
  selectedRole: string = ''; // Para almacenar el rol seleccionado por el usuario
  isAdmin: boolean = false; // Variable para verificar si el usuario es administrador
  
  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    // Verificar el rol del usuario al cargar la página
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        // Si el usuario está autenticado, verificar si tiene el rol de administrador
        this.authService.getUserRoles(user.uid).subscribe(roles => {
          this.isAdmin = roles.includes('admin');
          console.log('¿Es administrador?', this.isAdmin ? 'Sí' : 'No');
        });
      }
    });
  }

  
  
  
  async deleteUser(userId: string) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      deleteUser(user)
        .then(() => {
          // Eliminar documento de usuario en Firestore
          this.firestore.collection('usuarios').doc(userId).delete().then(() => {
            this.presentAlert('Usuario eliminado exitosamente.');
          }).catch(error => {
            console.error('Error al eliminar usuario en Firestore', error);
            this.presentAlert('Error al eliminar usuario.');
          });
        })
        .catch((error) => {
          console.error('Error al eliminar usuario en Authentication', error);
          this.presentAlert('Error al eliminar usuario.');
        });
    } else {
      console.error('No hay ningún usuario autenticado');
      this.presentAlert('No hay ningún usuario autenticado.');
    }
  }

  async openCreateUserAlert() {
    // Mostrar el diálogo de creación de usuario solo si el usuario es administrador
    if (this.isAdmin) {
      const alert = await this.alertController.create({
        header: 'Crear Usuario',
        inputs: [
          {
            name: 'username',
            type: 'text',
            placeholder: 'Nombre de usuario'
          },
          {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Crear',
            handler: (data) => {
              this.presentRoleSelectionAlert(data.username, data.password);
            }
          }
        ]
      });
  
      await alert.present();
    }
  }

  async presentRoleSelectionAlert(username: string, password: string) {
    const alert = await this.alertController.create({
      header: 'Seleccionar Rol',
      inputs: this.roles.map(role => ({
        name: 'role',
        type: 'radio',
        label: role,
        value: role
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Seleccionar',
          handler: (selectedRole) => {
            this.createUser(username, password, selectedRole);
          }
        }
      ]
    });

    await alert.present();
  }

  createUser(username: string, password: string, role: string) {
    this.authService.createUser(username, password, [role]).then(() => {
      this.presentAlert('Usuario creado exitosamente.');
    }).catch(error => {
      console.error('Error al crear usuario', error);
      this.presentAlert('Error al crear usuario.');
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Crear Usuario',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  printUsers() {
    // Mostrar la lista de usuarios solo si el usuario es administrador
    if (this.isAdmin) {
      this.firestore.collection('usuarios').get().subscribe(querySnapshot => {
        let usersData: { id: string, correo: string, roles: string[] }[] = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data() as Usuario;
          usersData.push({ id: doc.id, correo: userData.correo, roles: userData.roles });
        });

        this.presentUserSelectionAlert(usersData);
      });
    }
  }

  async presentUserSelectionAlert(usersData: { id: string, correo: string, roles: string[] }[]) {
    const alert = await this.alertController.create({
      header: 'Seleccione un usuario',
      inputs: usersData.map(user => ({
        name: user.id,
        type: 'radio',
        label: `${user.correo} - Roles: ${user.roles.join(', ')}`,
        value: user.id
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: (userId) => {
            this.deleteUser(userId);
          }
        }
      ]
    });

    await alert.present();
  }
}
