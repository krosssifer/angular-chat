import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ChatComponent } from './app/components/chat/chat.component';
import { UsernameDialogComponent } from './app/components/username-dialog/username-dialog.component';
import { UserService } from './app/services/user.service';

@Component({
  selector: 'app-root',
  template: `
    @if (!isUsernameSet) {
      <app-username-dialog />
    } @else {
      <app-chat />
    }
  `,
  standalone: true,
  imports: [ChatComponent, UsernameDialogComponent],
})
export class App {
  isUsernameSet: boolean;

  constructor(private userService: UserService) {
    this.isUsernameSet = userService.isUsernameSet();
    userService.getUsernameStream().subscribe(
      username => this.isUsernameSet = !!username
    );
  }
}

bootstrapApplication(App);