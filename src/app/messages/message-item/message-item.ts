import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.html',
  styleUrl: './message-item.css'
})
export class MessageItem implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService, private messageService: MessageService) {}

  ngOnInit(): void {
    // Initial attempt
    this.contactService.contactChangedEvent.subscribe((contacts: Contact[]) => {
       const contact: Contact = this.contactService.getContact(this.message.sender);
       this.messageSender = contact ? contact.name : 'Unknown Sender';
    });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(this.message);
    }
  }

  onEdit() {
    const newText = prompt('Edit Message Text:', this.message.msgText);

    if (newText !== null && newText !== this.message.msgText) {
      const newMessage = new Message(
        this.message.id,
        this.message.subject,
        newText,
        this.message.sender
      );

      this.messageService.updateMessage(this.message, newMessage);
    }
  }
}
