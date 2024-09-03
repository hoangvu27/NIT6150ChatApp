import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,  // Add standalone: true here
  imports: [FormsModule, CommonModule, HttpClientModule],  // Ensure FormsModule is correctly imported here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  username: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically load reCAPTCHA script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  startChat() {
    if (!this.username.trim()) {
      alert('Please enter your username.');
      return;
    }

    const recaptchaResponse = (window as any).grecaptcha.getResponse();

    if (!recaptchaResponse) {
      alert('Please complete the CAPTCHA');
      return;
    }

    this.userService.verifyCaptcha(recaptchaResponse).subscribe({
      next: (res: any) => {
        try {
          const parsedBody = JSON.parse(res.body);
          if (parsedBody.success === true) {
            (window as any).grecaptcha.reset(); // Reset the widget
            this.handleSuccessfulCaptcha();
          } else {
            alert('CAPTCHA verification failed. Please try again.');
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          alert('An error occurred while verifying CAPTCHA. Please try again.');
        }
      },
      error: (error) => {
        console.error('CAPTCHA verification error:', error);
        alert('An error occurred while verifying CAPTCHA. Please try again.');
      }
    });
  }

  private handleSuccessfulCaptcha() {
    // Add your logic to navigate to lobby or perform further actions
    this.router.navigate(['/lobby']);
  }
}
