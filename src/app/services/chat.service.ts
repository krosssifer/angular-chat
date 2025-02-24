import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private messages: Message[] = [];
  private messageSubject = new Subject<Message>();
  private readonly MESSAGES_KEY = 'chat_messages';

  constructor() {
    this.socket = io('http://localhost:3000');
    this.loadMessages();
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('chat message', (message: Message) => {
      if (!this.messages.some(m => m.id === message.id)) {
        this.messages.push(message);
        this.saveMessages();
        this.messageSubject.next(message);
      }
    });
  }

  private loadMessages() {
    const savedMessages = localStorage.getItem(this.MESSAGES_KEY);
    if (savedMessages) {
      try {
        this.messages = JSON.parse(savedMessages);
        this.messages.sort((a, b) => a.timestamp - b.timestamp);
        this.messages.forEach(message => this.messageSubject.next(message));
      } catch (error) {
        console.error('Error loading messages:', error);
        this.messages = [];
      }
    }
  }

  private saveMessages() {
    try {
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }

  getMessages(): Message[] {
    return [...this.messages].sort((a, b) => a.timestamp - b.timestamp);
  }

  getMessageStream(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  sendMessage(text: string, author: string) {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      author,
      timestamp: Date.now()
    };

    // Сохранение локально
    this.messages.push(message);
    this.saveMessages();
    this.messageSubject.next(message);

    // Отправить через WebSocket
    this.socket.emit('chat message', message);
  }

  destroy() {
    this.socket.disconnect();
  }
}