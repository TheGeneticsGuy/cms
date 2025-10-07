import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList {
  messages: Message[] = [
    new Message('1', 'Test Subject 1', 'Hey - Test msg1', 'Joe Smith'),
    new Message('2', 'Test Subject 2', 'Hey - Test msg2', 'AJ Top'),
    new Message('3', 'Test Subject 3', 'Hey - Test msg3', 'John Doe')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
