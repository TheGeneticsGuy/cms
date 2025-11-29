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
    this.http.get<Contact[]>('http://localhost:3000/contacts')
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

  // storeContacts() {
  //   this.contacts.sort((a, b) => a.name.localeCompare(b.name)); // Sorting before storing
  //   const contacts = JSON.stringify(this.contacts);
  //   const headers = new HttpHeaders({'Content-Type': 'application/json'});

  //   this.http.put('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/contacts.json', contacts, {headers: headers})
  //     .subscribe({
  //       next: () => {
  //         this.contactChangedEvent.next(this.contacts.slice());
  //       },
  //       error: (error: any) => {
  //         console.error(error);
  //       }
  //     });
  // }

  getContact(id: string): Contact {
    const contact = this.contacts.find(cont => cont.id === id);
    return contact || null;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts', newContact, { headers: headers })
      .subscribe({
        next: (responseData) => {
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/contacts/' + originalContact.id, newContact, { headers: headers })
      .subscribe({
        next: (response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe({
        next: (response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  sortAndSend() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.contactChangedEvent.next(this.contacts.slice());
  }

}
