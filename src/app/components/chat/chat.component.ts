import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { Message } from '../../models/message.model';
import { format } from 'date-fns';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-screen flex flex-col">
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Чат-приложение</h1>
            <p class="text-gray-600">Вошёл как: {{ username }}</p>
          </div>
          <button
            (click)="logout()"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Сменить пользователя
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4" #messageContainer>
        @for (message of messages; track message.id) {
          <div 
            class="p-4 rounded-lg" 
            [class]="message.author === username ? 'bg-blue-100 ml-auto max-w-[80%]' : 'bg-gray-100 max-w-[80%]'"
          >
            <div class="flex justify-between items-baseline">
              <span class="font-bold">{{ message.author }}</span>
              <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
            </div>
            <p class="mt-1">{{ message.text }}</p>
          </div>
        }
      </div>

      <div class="border-t p-4 bg-white">
        <form (ngSubmit)="sendMessage()" class="flex gap-2">
          <input
            type="text"
            [(ngModel)]="newMessage"
            name="message"
            class="flex-1 p-2 border rounded"
            placeholder="Напишите сообщение..."
            (keyup.enter)="sendMessage()"
          />
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            [disabled]="!newMessage.trim()"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: Message[] = [];
  newMessage = '';
  username: string;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {
    this.username = this.userService.getUsername() || '';
    this.userService.getUsernameStream().subscribe(username => {
      if (username) {
        this.username = username;
      }
    });
  }

  ngOnInit() {
    this.messages = this.chatService.getMessages();
    this.chatService.getMessageStream().subscribe(message => {
      if (!this.messages.some(m => m.id === message.id)) {
        this.messages = [...this.messages, message];
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim(), this.username);
      this.newMessage = '';
    }
  }

  formatTime(timestamp: number): string {
    return format(timestamp, 'HH:mm');
  }

  logout() {
    this.userService.logout();
  }

  private scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}