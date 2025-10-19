import { Injectable, EventEmitter} from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    const message = this.messages.find(msg => msg.id === id);
    return message || null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.getMessages());  // I used the getMessages method since it already has the slice().
  }
}
