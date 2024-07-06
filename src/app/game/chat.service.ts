import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); 
  }

  createRoom(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.emit('createRoom', (roomId: string) => {
        observer.next(roomId);
        observer.complete();
      });
    });
  }

  joinRoom(roomId: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socket.emit('joinRoom', roomId, (success: boolean) => {
        observer.next(success);
        observer.complete();
      });
    });
  }

  sendMessage(roomId: string, message: string) {
    this.socket.emit('sendMessage', roomId, message);
  }

  getMessages(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('message', (message: string) => {
        observer.next(message);
      });
    });
  }
}
