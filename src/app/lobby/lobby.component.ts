import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Add FormsModule and CommonModule to imports
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  username: string = '';
  messageText: string = '';
  messages: { sender: string, text: string }[] = [];

  // Declare the socket property
  private socket: WebSocket | null = null;

  //constructor(private router: Router, private userService: UserService ) {
  //  this.router.events.subscribe(event => {
  //    if (event instanceof NavigationEnd) {
  //      //console.log('Navigated to:', event.url);
  //    }
  //  });
  //}

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Retrieve the username from localStorage
      this.username = localStorage.getItem('username') ?? '';

      if (!this.username) {
        console.log("go back to home page");
        this.router.navigate(['/']);
      } else {
        // Retrieve chat history from sessionStorage on page load/refresh
        const storedMessages = sessionStorage.getItem('chatHistory');
        if (storedMessages) {
          this.messages = JSON.parse(storedMessages);  // Load chat history into the messages array
        }

        this.socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');
        this.socket.onmessage = (event) => {
          console.log('Message received:', event.data);
          const data = JSON.parse(event.data);
          this.addMessage({ sender: data.sender, text: data.text });
        };
        this.socket.onopen = () => {
          console.log('WebSocket connection established.');
        };
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
      }
    } else {
      console.log("Running on the server, skipping localStorage and sessionStorage access");
    }

  }

  addMessage(message: { sender: string, text: string }) {
    this.messages.push(message);

    // Save chat history to sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('chatHistory', JSON.stringify(this.messages));
    }
  }

  sendMessage() {
    if (this.messageText.trim() && this.socket) {  // Check if socket is not null
      const message = { sender: this.username, text: this.messageText };
      this.socket.send(JSON.stringify(message));
      this.addMessage(message);  // Add the sent message to the chat history
      this.messageText = '';
    }
  }
}



