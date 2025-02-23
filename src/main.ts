import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ChatComponent } from './app/components/chat/chat.component';
import { UsernameDialogComponent } from './app/components/username-dialog/username-dialog.component';
import { UserService } from './app/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent, UsernameDialogComponent],
  template: `
    @if (showUsernameDialog) {
      <app-username-dialog />
    } @else {
      <app-chat />
    }
  `
})
export class App implements OnInit {
  showUsernameDialog = false;

  constructor(private userService: UserService) {
    this.userService.getUsernameStream().subscribe(username => {
      this.showUsernameDialog = !username;
    });
  }

  ngOnInit() {
    this.showUsernameDialog = !this.userService.isUsernameSet();
  }
}

bootstrapApplication(App);