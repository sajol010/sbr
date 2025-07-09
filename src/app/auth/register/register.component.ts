import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../code/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userData = {};
  registerForm: FormGroup;

  constructor(
    public authService: AuthService
    , public fb: FormBuilder
    , public notify: NotificationService

  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }
      // {
      //   validators: this.passwordMatchValidator
      // }
    );
  }

  // Password match check
  // passwordMatchValidator(form: FormGroup) {
  //   const password = form.get('password')?.value;
  //   const confirmPassword = form.get('confirmPassword')?.value;
  //   return password === confirmPassword ? null : { mismatch: true };
  // }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          // Success message show using toastr
          // this.notify.error('Registration successful!', 'Welcome');
          // Save token and user info to cookies
          this.authService.loginSuccess(res);    
        },
        error: (err) => {
          console.error('Registration failed', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched(); // Show all validation errors if any field is untouched
    }
  }


}
