
import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

@Injectable()

export class AuthService implements OnInit {
  
  provider: firebase.auth.GoogleAuthProvider;
  
  constructor(public afAuth: AngularFireAuth) {
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  ngOnInit(){} 
  
  loginWithGoogle() {
    return this.afAuth.signInWithRedirect(this.provider);
  }
  
  logout() {
    return this.afAuth.signOut();
  }
  
}
