import { Component } from '@angular/core';
import { AuthService } from '../../code/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials = {};
  loginForm: FormGroup;

  constructor(  
    public authService: AuthService
    , public fb: FormBuilder
    , private router: Router
  ) {

    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }
     
    );
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // Save token and user info to cookies
          this.authService.loginSuccess(res);                             
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
    } else {
      // Show all validation errors if any field is untouched
      this.loginForm.markAllAsTouched(); 
    }
  }

  // login success 
  //localStorage.setItem('access_token', response.token);

  // logout
  //localStorage.removeItem('access_token');
}
