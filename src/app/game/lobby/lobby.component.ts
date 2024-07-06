import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {
  roomId: string = '';

  constructor(private router: Router, private chatService: ChatService) {}

  joinRoom() {
    if (this.roomId) {
      this.chatService.joinRoom(this.roomId).subscribe(success => {
        if (success) {
          this.router.navigate(['/room', this.roomId]);
        } else {
          alert('Room not found');
        }
      });
    }
  }

  createRoom() {
    this.chatService.createRoom().subscribe(roomId => {
      this.router.navigate(['/master-room', roomId]);
    });
  }
}
