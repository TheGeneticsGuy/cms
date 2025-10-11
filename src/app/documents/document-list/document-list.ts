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
      'Full Stack Development',
      // '../../assets/images/WDD430.webp',
      'https://www.byui.edu/catalog/#/courses/VJkxTr9Ab?q=wdd%20430&&limit=20&skip=0&bc=true&bcCurrent=&bcCurrent=Web%20Full-Stack%20Development&bcItemType=courses',
      null),
    new Document(
      '2',
      'CSE 430',
      'Software Architecture',
      // '../../assets/images/CSE430.webp',
      'https://www.byui.edu/catalog/#/courses/rJy7aiD2Q?q=CSE%20430&&limit=20&skip=0&bc=true&bcCurrent=&bcCurrent=Architectural%20Design&bcItemType=courses',
      null),
    new Document('3',
      'CSE 499',
      'Senior Project Capstone',
      // '../../assets/images/CSE499.webp',
      'https://www.byui.edu/catalog/#/courses/Ek-Px2lho-?q=CSE%20499&&limit=20&skip=0&bc=true&bcCurrent=&bcCurrent=Senior%20Project&bcItemType=courses',
      null),
    new Document(
      '4',
      'CSE 310',
      'Applied Programming',
      // '../../assets/images/CSE310.webp',
      'https://www.byui.edu/catalog/#/courses/H1Rj-iP3X?q=CSE310&&limit=20&skip=0&bc=true&bcCurrent=&bcCurrent=Applied%20Programming&bcItemType=courses',
      null)
    ]

    // For emitting the document to the html file
    onSelectedDocument(document: Document) {
      this.selectedDocumentEvent.emit(document);
    }
}
