import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(private router: Router, private userService: UserService ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //console.log('Navigated to:', event.url);
      }
    });
  }

  ngOnInit(): void {
    // Retrieve the username from the UserService
    this.username = this.userService.getUsername() ?? '';

    if (!this.username) {
      this.router.navigate(['/']);
    } else {
      this.socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');
      this.socket.onmessage = (event) => {
        console.log('Message received:', event.data);
        const data = JSON.parse(event.data);
        this.messages.push({ sender: data.sender, text: data.text });
      };
      this.socket.onopen = () => {
        console.log('WebSocket connection established.');
      };
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }

    
  }

  sendMessage() {
    if (this.messageText.trim() && this.socket) {  // Check if socket is not null
      const message = { sender: this.username, text: this.messageText };
      this.socket.send(JSON.stringify(message));
      this.messages.push(message);
      this.messageText = '';

      //setTimeout(() => {
      //  this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      //}, 100); // Ensure the DOM updates before scrolling
    }
  }
}



