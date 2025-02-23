import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages: Message[] = [];
  private messageSubject = new Subject<Message>();
  private broadcastChannel = new BroadcastChannel('chat_channel');
  private readonly MESSAGES_KEY = 'chat_messages';
  private isProcessingBroadcast = false;

  constructor() {
    this.loadMessages();
    this.setupBroadcastChannel();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'NEW_MESSAGE') {
        this.isProcessingBroadcast = true;
        const message = event.data.message;
        if (!this.messages.some(m => m.id === message.id)) {
          this.messages.push(message);
          this.saveMessages();
          this.messageSubject.next(message);
        }
        this.isProcessingBroadcast = false;
      }
    };
  }

  private loadMessages() {
    const savedMessages = localStorage.getItem(this.MESSAGES_KEY);
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
  }

  private saveMessages() {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(this.messages));
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getMessageStream(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  sendMessage(text: string, author: string) {
    if (this.isProcessingBroadcast) {
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      text,
      author,
      timestamp: Date.now()
    };

    // Add to local messages first
    this.messages.push(message);
    this.saveMessages();

    // Only emit if we're not processing a broadcast
    if (!this.isProcessingBroadcast) {
      this.messageSubject.next(message);
      this.broadcastChannel.postMessage({ type: 'NEW_MESSAGE', message });
    }
  }
}