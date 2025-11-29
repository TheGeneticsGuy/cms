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
    this.http.get<{message: string, messages: Message[]}>('http://localhost:3000/messages')
      .subscribe({
        next: (responseData) => {
          this.messages = responseData.messages || [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error: any) => {
          console.error(error);
        }
      });

    return this.messages.slice();
  }

  // storeMessages() {
  //   const messages = JSON.stringify(this.messages);
  //   const headers = new HttpHeaders({'Content-Type': 'application/json'});

  //   this.http.put('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/messages.json', messages, {headers: headers})
  //     .subscribe({
  //       next: () => {
  //         this.messageChangedEvent.emit(this.messages.slice());
  //       },
  //       error: (error: any) => {
  //         console.error(error);
  //       }
  //     });
  // }

  getMessage(id: string): Message | null {
    const message = this.messages.find(msg => msg.id === id);
    return message || null;
  }

  addMessage(message: Message) {
    if (!message) return;

    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, newMessage: Message }>('http://localhost:3000/messages', message, { headers: headers })
      .subscribe({
        next: (responseData) => {
          this.messages.push(responseData.newMessage);
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error) => console.error(error)
      });
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) return;

    newMessage.id = originalMessage.id;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/messages/' + originalMessage.id, newMessage, { headers: headers })
      .subscribe({
        next: (response) => {
          this.messages[pos] = newMessage;
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error) => console.error(error)
      });
  }

  deleteMessage(message: Message) {
    if (!message) return;

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) return;

    this.http.delete('http://localhost:3000/messages/' + message.id)
      .subscribe({
        next: (response) => {
          this.messages.splice(pos, 1);
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error) => console.error(error)
      });
  }

}
