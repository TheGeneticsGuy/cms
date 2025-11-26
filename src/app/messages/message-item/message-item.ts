import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.html',
  styleUrl: './message-item.css'
})
export class MessageItem implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService) {}

  loadContacts() {
    const contact: Contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact ? contact.name : 'Unknown Sender' ;
  }

  ngOnInit(): void {
    // Initial attempt
    this.loadContacts();

    // subscribe if contact wasn't found
    this.contactService.contactChangedEvent.subscribe(() => {
       this.loadContacts();
    });

     if (this.contactService.getContacts().length === 0) {
      this.contactService.getContacts(); // Forcing fetch if empty
    }

  }
}
