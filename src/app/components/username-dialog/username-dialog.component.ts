import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-username-dialog',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-blue-500 transform scale-150">:)</mat-icon>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Добро Пожаловать</h2>
          <p class="text-gray-600 mt-2">Введите имя, чтобы продолжить</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #form="ngForm" class="space-y-4">
          <div>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              required
              minlength="2"
              maxlength="20"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="Ваше имя"
            >
          </div>
          <button
            type="submit"
            [disabled]="!username.trim() || username.length < 2"
            class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Продолжить
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