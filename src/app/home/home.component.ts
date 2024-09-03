import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserService]
})
export class HomeComponent {
  socket: WebSocket | null = null;
  username: string = '';

  constructor(private router: Router, private userService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let socket = this.userService.getSocket();

      if (!socket) {
        socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');
        this.userService.setSocket(socket);

        socket.onopen = () => {
          console.log('WebSocket connection established.');
        };

        socket.onmessage = (event) => {
          // Handle incoming messages from the WebSocket
        };

        socket.onclose = () => {
          console.log('WebSocket connection closed.');
        };
      }
    } else {
      console.log('WebSocket is not supported on the server-side.');
    }
  }

  startChat() {
    if (this.username.trim()) {
      if ((window as any).grecaptcha) {
        (window as any).grecaptcha.ready(() => {
          const recaptchaResponse = (window as any).grecaptcha.getResponse();

          if (!recaptchaResponse) {
            alert('Please complete the CAPTCHA');
            return;
          }

          this.userService.verifyCaptcha(recaptchaResponse).subscribe({
            next: (res: any) => {
              if (res.success) {
                this.handleSuccessfulCaptcha();
              } else {
                alert('CAPTCHA verification failed. Please try again.');
              }
            },
            error: (error) => {
              alert('An error occurred while verifying CAPTCHA. Please try again.');
              console.error('CAPTCHA verification error:', error);
            }
          });
        });
      } else {
        console.error('reCAPTCHA is not loaded. Please check your setup.');
        alert('reCAPTCHA is not loaded correctly. Please refresh the page and try again.');
      }
    } else {
      alert('Please enter your username.');
    }
  }

  private handleSuccessfulCaptcha() {
    if (isPlatformBrowser(this.platformId)) {
      const socket = this.userService.getSocket();
      console.log("after userService getSocket");
      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
          action: 'joinLobby',
          username: this.username
        };
        socket.send(JSON.stringify(message));
        console.log('Join lobby message sent:', message);

        sessionStorage.setItem('username', this.username);
        this.router.navigate(['/lobby']);
      } else {
        console.log('WebSocket is not open.');
        alert('WebSocket connection is not open. Please try again.');
      }
    }
  }
}
