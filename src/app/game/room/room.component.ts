import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {
  roomId: string = '';
  newMessage: string = '';
  messages: string[] = [];

  constructor(private route: ActivatedRoute, private chatService: ChatService) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id') || '';

    this.chatService.joinRoom(this.roomId).subscribe(success => {
      if (!success) {
        alert('Failed to join room');
      }
    });

    this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.newMessage) {
      this.chatService.sendMessage(this.roomId, this.newMessage);
      this.newMessage = '';
    }
  }
}
