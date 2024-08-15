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
  //constructor(private router: Router, private userService: UserService) { }

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  //constructor(private router: Router) { }

  ngOnInit(): void {
    // Establish WebSocket connection when the home page loads
    //this.socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');

    //this.socket.onopen = () => {
    //  console.log('WebSocket connection established in home page.');
    //};

    //this.socket.onmessage = (event) => {
    //  console.log('Message received:', event.data);
    //};

    //this.socket.onclose = () => {
    //  console.log('WebSocket connection closed.');
    //};

    // Check if the platform is a browser (because WebSocket is only available in the browser)
    if (isPlatformBrowser(this.platformId)) {
      // Only run WebSocket code in the browser environment
      this.socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');

      this.socket.onopen = () => {
        console.log('WebSocket connection established in home page.');
      };

      this.socket.onmessage = (event) => {
        console.log('Message received:', event.data);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed.');
      };
    }
  }

  //startChat() {
  //  if (this.username.trim()) {
  //    this.userService.setUsername(this.username);
  //    this.router.navigate(['/lobby']);
  //  }
  //}

  startChat() {
    if (this.username.trim() && this.socket) {
      const message = {
        action: 'joinLobby',  // Custom action for joining the lobby
        username: this.username
      };
      this.socket.send(JSON.stringify(message));
      console.log('Join lobby message sent:', message);

      // Navigate to the lobby after sending the message
      localStorage.setItem('username', this.username);
      this.router.navigate(['/lobby']);
    }
  }

}
