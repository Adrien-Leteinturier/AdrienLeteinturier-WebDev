import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';

declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService) { }
    
  login() {
    this.authService.loginWithGoogle();
  }

  ngOnInit() {
    const main = document.getElementById('main-content');
    $('a[href^="#"]').click(function(){
      var the_id = $(this).attr("href");
      if (the_id === '#') {
        return;
      }
      $(main).animate({
        scrollTop:$(the_id).offset().top
      }, 'slow');
      return false;
    });
    

  }

}
