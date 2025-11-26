import { Injectable, EventEmitter} from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {}

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessages(): Message[] {
    this.http.get<Message[]>('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/messages.json')
      .subscribe({
        next: (messages: Message[]) => {
          this.messages = messages || [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error: any) => {
          console.error(error);
        }
      });

    return this.messages.slice();
  }

  storeMessages() {
    const messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/messages.json', messages, {headers: headers})
      .subscribe({
        next: () => {
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }

  getMessage(id: string): Message | null {
    const message = this.messages.find(msg => msg.id === id);
    return message || null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
