// AuthService
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  getCurrentUser() {
    return this.afAuth.authState;
  }

  getUserRoles(userId: string) {
    return this.firestore.collection('usuarios').doc(userId).valueChanges().pipe(
      map((user: any) => user ? user.roles : [])
    );
  }

  async login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    return this.afAuth.signOut();
  }

  async createUser(email: string, password: string, roles: string[]) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential && userCredential.user) {
        await this.createFirestoreUserDocument(userCredential.user.uid, email, roles);
        console.log('Usuario creado exitosamente', userCredential.user);
      } else {
        console.error('El objeto userCredential o user es nulo');
      }
    } catch (error) {
      console.error('Error al crear el usuario', error);
    }
  }

  private async createFirestoreUserDocument(userId: string, email: string, roles: string[]) {
    try {
      await this.firestore.collection('usuarios').doc(userId).set({
        correo: email,
        roles: roles
      });
      console.log('Documento de usuario creado exitosamente en Firestore');
    } catch (error) {
      console.error('Error al crear el documento de usuario en Firestore', error);
    }
  }

  async assignRoles(userId: string, roles: string[]) {
    try {
      await this.firestore.doc(`users/${userId}`).set({ roles }, { merge: true });
      console.log('Roles asignados correctamente');
    } catch (error) {
      console.error('Error al asignar roles', error);
    }
  }

  // Método para verificar si el usuario está autenticado
  async isAuthenticated() {
    const user = await this.afAuth.authState.toPromise();
    return !!user;
  }


}
