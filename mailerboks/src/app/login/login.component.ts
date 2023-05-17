import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  login(): void {
    this.http
      .post<any>('http://localhost:3000/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {
          // If login is successful, redirect to the dashboard
          window.location.href = '/dashboard';
        },
        (error) => {
          // If login fails, display an error message
          alert('Login failed. Please check your credentials.');
        }
      );
  }
}
