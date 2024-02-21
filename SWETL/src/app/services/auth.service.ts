import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

// Definir una interfaz para los datos de usuario
interface UserData {
  rol: string[]; // Define la propiedad rol y su tipo
  // Puedes agregar otras propiedades si las hay
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firestore: AngularFirestore
  ) {}

  login(email: string, password: string) {
    // Verificar si el usuario existe en Firestore y las credenciales son correctas
    return this.firestore.collection('usuarios', ref => ref.where('correo', '==', email).where('contraseña', '==', password)).get()
      .pipe(
        map(snapshot => {
          if (snapshot.empty) {
            // No se encontró ningún usuario con las credenciales proporcionadas
            throw new Error('Correo electrónico o contraseña incorrectos.');
          } else {
            // Usuario encontrado, devuelve el documento de usuario
            const userData = snapshot.docs[0].data();
            return userData;
          }
        })
      );
  }


   /// Método para obtener los roles del usuario actual
   async getUserRoles(userId: string) {
    try {
      const userDoc = await this.firestore.collection('usuarios').doc(userId).get().toPromise();
      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as UserData;
        const roles = userData?.rol;
        console.log('Roles del usuario:', roles);
        return roles;
      } else {
        console.error('Documento de usuario no encontrado en Firestore.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener roles del usuario en Firestore:', error);
      return null;
    }
  }
}
