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
  private instanceCount = 0;

  constructor(private http: HttpClient) {
    this.instanceCount++;
    this.socket = new WebSocket('wss://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production/');
    console.log(`UserService instance count: ${this.instanceCount}`);
  }

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

  // Method to verify the reCAPTCHA response with the backend
  verifyCaptcha(recaptchaResponse: string): Observable<any> {
    const url = 'https://cz7ykaqk6g.execute-api.ap-southeast-2.amazonaws.com/production/verify-captcha'; // Replace with your actual backend URL
    return this.http.post(url, { response: recaptchaResponse }).pipe(
      catchError(this.handleError) // Handle errors gracefully
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
