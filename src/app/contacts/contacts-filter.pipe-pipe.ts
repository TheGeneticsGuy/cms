import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilterPipe',
  standalone: false
})
export class ContactsFilterPipePipe implements PipeTransform {

  transform(contacts: Contact[], term: string): any {
    let filteredContacts: Contact[] = [];

    if (term && term.length > 0) {
       filteredContacts = contacts.filter(
          (contact: Contact) => contact.name.toLowerCase().includes(term.toLowerCase()) // Using filter function ex. instead of for loop
       );
    }

    if (filteredContacts.length < 1){
       return contacts;
    }

    return filteredContacts;
  }

}
