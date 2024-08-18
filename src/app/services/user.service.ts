import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username: string = '';
  private socket: WebSocket | null = null;

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  getSocket(): WebSocket | null {
    return this.socket;
  }
}
