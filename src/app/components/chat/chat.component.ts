import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { Message } from '../../models/message.model';
import { format } from 'date-fns';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="h-screen flex flex-col bg-gray-100">
      <!-- Header -->
      <div class="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-800">Чат комната</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">{{ username }}</span>
          <button
            (click)="logout()"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            
            Сменить имя
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4" #messageContainer>
        @for (message of messages; track message.id) {
          <div 
            class="flex"
            [class]="message.author === username ? 'justify-end' : 'justify-start'"
          >
            <div class="flex flex-col max-w-[70%]">
              <div class="flex items-center gap-2 mb-1"
                [class]="message.author === username ? 'flex-row-reverse' : ''">
                <span class="text-sm text-gray-600">{{ message.author }}</span>
                <span class="text-xs text-gray-400">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div
                class="rounded-2xl px-4 py-2 shadow-sm"
                [class]="message.author === username ? 
                  'bg-blue-500 text-white rounded-br-none' : 
                  'bg-white text-gray-800 rounded-bl-none'"
              >
                <p class="break-words text-xl">{{ message.text }}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="bg-white border-t px-6 py-4">
        <form (ngSubmit)="sendMessage()" class="flex gap-3">
          <div class="flex-1 relative">
            <input
              type="text"
              [(ngModel)]="newMessage"
              name="message"
              class="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="Напишите сообщение"
              (keyup.enter)="sendMessage()"
            >
          </div>
          <button
            type="submit"
            [disabled]="!newMessage.trim()"
            class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
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
        this.messages = [...this.messages, message].sort((a, b) => a.timestamp - b.timestamp);
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.chatService.destroy();
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