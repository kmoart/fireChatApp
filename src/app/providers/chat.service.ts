import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from "../interface/mensaje.interface";
import { map } from 'rxjs/operators';


import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};


  constructor( private afs: AngularFirestore,
               public afAuth: AngularFireAuth ) {

                  this.afAuth.authState.subscribe( user => {

                    console.log('Estado del usuario: ', user );// verificamos lo que llega en la variable user
                   
                    if( !user ){
                       return; 
                    }

                    this.usuario.nombre = user.displayName;
                    this.usuario.uid = user.uid; // el uid nos sirve para registrar de forma únca el mensaje de un usuario en particular
                  });// De ésta manera vamos a estar escuchando cualquier cambio que suceda en el estado de la autentcación
                }
  
  login( proveedor: string ) {

    if( proveedor == 'google'){
    
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    
    }else if( proveedor == 'twitter'){

      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
      
    }else{
      this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
    }
  }
  
  logout() {
      this.usuario = {}; // se le asigna un objeto vacío al usuario creado para borrar las propiedades que pudiera tener.
      this.afAuth.auth.signOut();
  }

  cargarMensajes(){

    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                                            .limit(5));

    return this.itemsCollection.valueChanges()
    .pipe( map( mensajes => { // éste observable estará pendiente de todos los cambios del nodo de chats
      //console.log(mensajes);
      this.chats = [];

      for(let mensaje of mensajes){
          this.chats.unshift( mensaje ); // unshift inserta siempre al comienzo
      }

      return this.chats; // éste return es opcional

    }));// map() trabaja con la respuesta de un observable, la trnasforma y vuelve a regresar algo para poder realizar el subscribe

    
    /*
    .map( ( mensajes: Mensaje[] ) => {
      console.log( mensajes );
    })
    */
  }


  agregarMensaje( texto: string){

    //TODO falta el UID usuario 
    let mensaje: Mensaje = {
          nombre: this.usuario.nombre,
          mensaje: texto,
          fecha: new Date().getTime(),
          uid: this.usuario.uid
    }

    return this.itemsCollection.add( mensaje );

  }
}
