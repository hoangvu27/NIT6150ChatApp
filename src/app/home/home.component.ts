import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
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
  username: string = '';

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    //console.log("HomeComponent initialized"); // This should appear when the component loads
  }

  startChat() {
    if (this.username.trim()) {
      this.userService.setUsername(this.username);
      this.router.navigate(['/lobby']);
      //this.router.navigate(['/lobby'], { state: { username: this.username } });
      //this.router.navigate(['/lobby', this.username]);
    }
  }
}
