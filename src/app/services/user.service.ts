import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username: string = '';
  private socket: WebSocket | null = null;

  constructor(private http: HttpClient) { }

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

  // Implement the verifyCaptcha method
  verifyCaptcha(recaptchaResponse: string): Observable<{ success: boolean }> {
    // Replace '/verify-captcha' with your actual backend endpoint that handles CAPTCHA verification
    return this.http.post<{ success: boolean }>('/verify-captcha', { recaptchaResponse });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 403) {
      // Handle CAPTCHA failure specifically
      return throwError(() => new Error('CAPTCHA verification failed.'));
    } else {
      // Handle other errors
      return throwError(() => new Error('An unexpected error occurred.'));
    }
  }
}
