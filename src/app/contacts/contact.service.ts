import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice().
      sort((a, b) => a.name.localeCompare(b.name));  // Added alphabetical sorting as image showed that.
  }

  getContact(id: string): Contact {
    const contact = this.contacts.find(cont => cont.id === id)
    return contact || null;
  }
}
