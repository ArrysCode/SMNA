import { Component , OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAdmin: boolean = false;
  roles: string[] = ['user', 'admin'];
  selectedRole: string = '';
  usersData: { id: string, correo: string, rol: string[] }[] = [];
  currentUserRoles: string[] = [];

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.isAdmin = true; // Implementa tu lógica para determinar si el usuario es administrador
    this.loadUsersData(); // Cargar datos de usuario al inicializar
    
    
  
  }

  async openCreateUserAlert() {
    // Mostrar el diálogo de creación de usuario solo si el usuario es administrador
    if (this.isAdmin) {
      const alert = await this.alertController.create({
        header: 'Crear Usuario',
        inputs: [
          {
            name: 'correo',
            type: 'text',
            placeholder: 'Nombre de usuario'
          },
          {
            name: 'contraseña',
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
              this.presentRoleSelectionAlert(data.correo, data.contraseña);
            }
          }
        ]
      });

      await alert.present();
    }
  }

  async presentRoleSelectionAlert(correo: string, contraseña: string) {
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
            this.createUser(correo, contraseña, selectedRole);
          }
        }
      ]
    });

    await alert.present();
  }

  createUser(correo: string, contraseña: string, rol: string) {
    // Verifica si el rol es válido antes de agregar el usuario a Firestore
    if (rol) {
      // Ahora puedes agregar el usuario a Firestore con el rol proporcionado
      this.firestore.collection('usuarios').add({ correo, contraseña, rol: [rol] })
        .then(() => {
          this.presentAlert('Usuario creado exitosamente.');
        })
        .catch(error => {
          console.error('Error al agregar usuario a Firestore:', error);
          this.presentAlert('Error al crear usuario.');
        });
    } else {
      console.error('Rol no válido:', rol);
      // Aquí puedes manejar el caso cuando el rol no es válido
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Crear Usuario',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  async openDeleteUserAlert() {
    // Mostrar el diálogo de selección de usuario para eliminar solo si el usuario es administrador
    if (this.isAdmin) {
      const alert = await this.alertController.create({
        header: 'Eliminar Usuario',
        message: 'Seleccione un usuario para eliminar:',
        inputs: this.usersData.map(user => ({
          name: user.id,
          type: 'radio',
          label: `${user.correo} - Roles: ${user.rol}`,
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

  async deleteUser(userId: string) {
    try {
      await this.firestore.collection('usuarios').doc(userId).delete();
      this.presentAlert('Usuario eliminado exitosamente.');
      this.loadUsersData(); // Volver a cargar los datos de usuario después de eliminar uno
    } catch (error) {
      console.error('Error al eliminar usuario en Firestore', error);
      this.presentAlert('Error al eliminar usuario.');
    }
  }

  loadUsersData() {
    // Cargar datos de usuario desde Firestore
    this.firestore.collection('usuarios').get().subscribe(querySnapshot => {
      this.usersData = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data() as { correo: string, rol: string[] };
        this.usersData.push({ id: doc.id, correo: userData.correo, rol: userData.rol });
      });
      // Obtener los roles del usuario actual (por ejemplo, mediante Firestore)
      // this.currentUserRoles = rolesObtenidos;
    });
  }
  }
  










  

