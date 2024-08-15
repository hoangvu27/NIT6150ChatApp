import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule], // Add FormsModule and CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrected typo
})
export class AppComponent {
  title = 'chat-app';
}
