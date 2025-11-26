import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new Subject<Contact>();
  contactChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getContacts(): Contact[] {
    this.http.get<Contact[]>('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/contacts.json')
      .subscribe({
        next: (contacts: Contact[]) => {
          this.contacts = contacts || [];
          this.maxContactId = this.getMaxId();

          // Sort alphabetically
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));

          this.contactChangedEvent.next(this.contacts.slice());
        },
        error: (error: any) => {
          console.error(error);
        }
      });

      return this.contacts.slice();
  }

  storeContacts() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name)); // Sorting before storing
    const contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/contacts.json', contacts, {headers: headers})
      .subscribe({
        next: () => {
          this.contactChangedEvent.next(this.contacts.slice());
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }

  getContact(id: string): Contact {
    const contact = this.contacts.find(cont => cont.id === id);
    return contact || null;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);

    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}
