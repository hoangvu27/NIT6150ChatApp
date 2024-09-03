//import { Component } from '@angular/core';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule, not Router
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],  // Add FormsModule and CommonModule to imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  socket: WebSocket | null = null;
  username: string = '';
  constructor(private router: Router, private userService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  //constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // Only run WebSocket-related code in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      let socket = this.userService.getSocket();

      // If no socket exists yet, create a new one
      if (!socket) {
        socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');
        this.userService.setSocket(socket);

        socket.onopen = () => {
          console.log('WebSocket connection established.');
        };

        socket.onmessage = (event) => {
          //console.log('Message received:', event.data);
        };

        socket.onclose = () => {
          //console.log('WebSocket connection closed.');
        };
      }
    } else {
      console.log('WebSocket is not supported on the server-side.');
    }
  }


  startChat() {
    if (this.username.trim()) {
      // Ensure WebSocket is established in the browser environment
      if (isPlatformBrowser(this.platformId)) {
        const socket = this.userService.getSocket();

        if (socket && socket.readyState === WebSocket.OPEN) {
          const message = {
            action: 'joinLobby',
            username: this.username
          };
          socket.send(JSON.stringify(message));
          //console.log('Join lobby message sent:', message);

          // Store the username in sessionStorage
          sessionStorage.setItem('username', this.username);

          // Navigate to the lobby
          this.router.navigate(['/lobby']);
        } else {
          console.log('WebSocket is not open.');
        }
      }
    }
  }

}
