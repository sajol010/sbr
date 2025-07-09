import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../code/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userInfo:any = {};
  constructor(  
    public authService: AuthService
    , private router: Router
  ) {

  }
  ngOnInit() {
    this.userInfo = this.authService.getUser();
  }

  onLogout(event:any){
    if (event) {
      event.preventDefault();
    }
    this.authService.logout();    
  }
}
