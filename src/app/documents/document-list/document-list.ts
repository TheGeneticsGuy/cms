import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrl: './document-list.css'
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      '1',
      'WDD 430',
      'This is the Software Architecture Course.',
      '../../assets/images/WDD430.webp',
      null),
    new Document(
      '2',
      'CSE 430',
      'This os the Full Stack Dev Course.',
      '../../assets/images/CSE430.webp',
      null),
    new Document('3',
      'CSE 499',
      'This is the Senior Capstone.',
      '../../assets/images/CSE499.webp',
      null),
    new Document(
      '4',
      'CSE 310',
      'This is the Applied Programming Course.',
      '../../assets/images/CSE310.webp',
      null)
    ]

    // For emitting the document to the html file
    onSelectedDocument(document: Document) {
      this.selectedDocumentEvent.emit(document);
    }
}
