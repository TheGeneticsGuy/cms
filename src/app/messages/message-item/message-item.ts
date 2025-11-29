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

  ngOnInit(): void {
    // Initial attempt
    this.contactService.contactChangedEvent.subscribe((contacts: Contact[]) => {
       const contact: Contact = this.contactService.getContact(this.message.sender);
       this.messageSender = contact ? contact.name : 'Unknown Sender';
    });

  }
}
