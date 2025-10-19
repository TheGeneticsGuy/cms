import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  contacts: Contact[] = [];

  constructor( private contactService: ContactService) {
  }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
  }

  // We need to emit this data up to parent (contacts)
  // Contacts will then output it to the contact-detail
  onSelected(contact: Contact ) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
