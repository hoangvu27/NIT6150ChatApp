import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule, CommonModule ],  // Add FormsModule and CommonModule to imports
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  username: string = '';
  messageText: string = '';
  messages: { sender: string, text: string }[] = [];
  lobbyCount: number = 0;  // Add this line to your LobbyComponent class


  // Declare the socket property
  private socket: WebSocket | null = null;

  //constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    //if (isPlatformBrowser(this.platformId)) {
    //} else {
    //  console.log("Running on the server, skipping localStorage and sessionStorage access");
    //}
    //this.username = localStorage.getItem('username') ?? '';
    let usernameFromService = this.userService.getUsername();
    this.username = usernameFromService ? usernameFromService : sessionStorage.getItem('username') ?? '';
    this.socket = this.userService.getSocket();

    if (!this.username || !this.socket) {
      // Redirect back to home if username or WebSocket is not present
      this.router.navigate(['/']);
      return;
    } else {
        // Retrieve chat history from sessionStorage on page load/refresh
        const storedMessages = sessionStorage.getItem('chatHistory');
        if (storedMessages) {
          this.messages = JSON.parse(storedMessages);  // Load chat history into the messages array
        }

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'lobbyCountUpdate') {
            this.lobbyCount = data.count;  // Update the lobby count from the server
            console.log(this.lobbyCount);
          } else {
            this.addMessage({ sender: data.sender, text: data.message });
          }
        };
        this.socket.onopen = () => {
          console.log('WebSocket connection established.');
        };
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
      }
    

  }

  addMessage(message: { sender: string, text: string }) {
    this.messages.push(message);
    sessionStorage.setItem('chatHistory', JSON.stringify(this.messages));
    // Save chat history to sessionStorage
    //if (isPlatformBrowser(this.platformId)) {
     
    //}
  }

  sendMessage() {
    if (this.messageText.trim() && this.socket && this.socket.readyState === WebSocket.OPEN) {  // Check if socket is not null
      //const message = { sender: this.username, text: this.messageText };
      //console.log('message is being sent');
      //this.socket.send(JSON.stringify(message));
      //this.addMessage(message);  // Add the sent message to the chat history
      //this.messageText = '';

      if (this.socket.readyState === WebSocket.OPEN) {  // Ensure the WebSocket is open
        const message = {
          action: 'sendMessage',  // Ensure the action is set correctly for WebSocket API route
          message: this.messageText
        };
        this.socket.send(JSON.stringify(message));
        //this.addMessage({ sender: this.username, text: this.messageText });  // this line only shows message of sender which is on UI of sender
        this.messageText = '';
      } else {
        console.log('WebSocket is not open: ReadyState =', this.socket.readyState);
      }
    }


  }
}



