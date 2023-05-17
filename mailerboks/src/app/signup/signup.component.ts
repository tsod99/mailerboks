import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: [''],
    });
  }

  submitForm() {
    if (this.signupForm.valid) {
      const url = 'http://localhost:3000/signup';

      const formData = {
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        phoneNumber: this.signupForm.value.phoneNumber,
      };

      this.http.post(url, formData).subscribe(
        (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/navbar'], {
            queryParams: { firstName: this.signupForm.value.firstName },
          });
        },
        (error) => {
          console.error('Signup failed', error);
          this.snackBar.open('Signup failed. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
}
