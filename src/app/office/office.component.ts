import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {Observable} from 'rxjs';
import firebase from 'firebase';

@Component({

  selector: 'office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']

})

export class OfficeComponent implements OnInit {

  user: Observable<firebase.User>;
  pseudo: string;
  email: string;
  photoUrl: string;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.afAuth.authState;
    this.user.subscribe((auth) => {
        this.addValueAuth(auth);
      }
    );
  };

  addValueAuth(auth) {
    if (auth) {
      this.pseudo = auth.displayName;
      this.email = auth.email;
      this.photoUrl = auth.photoURL;
    }
  }

  ngOnInit() {
  }


  logout() {
    this.authService.logout();
    window.location.href = '/';

  }
}
