import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'chat_username';
  private usernameSubject = new BehaviorSubject<string | null>(this.getUsername());

  getUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  setUsername(username: string): void {
    localStorage.setItem(this.USER_KEY, username);
    this.usernameSubject.next(username);
  }

  isUsernameSet(): boolean {
    return !!this.getUsername();
  }

  getUsernameStream(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.usernameSubject.next(null);
  }
}