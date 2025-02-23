import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-username-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h2 class="text-xl font-bold mb-4">Enter your name</h2>
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <input
            type="text"
            [(ngModel)]="username"
            name="username"
            required
            minlength="2"
            class="w-full p-2 border rounded mb-4"
            placeholder="Your name"
          />
          <button
            type="submit"
            [disabled]="!form.valid"
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  `
})
export class UsernameDialogComponent {
  username = '';

  constructor(private userService: UserService) {}

  onSubmit() {
    if (this.username.trim()) {
      this.userService.setUsername(this.username.trim());
      window.location.reload();
    }
  }
}