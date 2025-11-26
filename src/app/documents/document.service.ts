import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new Subject<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getDocuments() {
    this.http.get<Document[]>('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/documents.json')
      .subscribe({
        next: (documents: Document[]) => { // using modern syntax
          this.documents = documents || [];
          this.maxDocumentId = this.getMaxId();

          this.documents.sort((a, b) => { // sorting alphabetically
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error: any) => {
          console.error(error);
        }
      });

    return this.documents.slice();
  }

  storeDocuments() {
    const documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/documents.json', documents, {headers: headers})
      .subscribe({
        next: () => {
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error: any) => {
           console.error(error);
        }
      });
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  getDocument(id: string): Document | null {
    const document = this.documents.find(doc => doc.id === id);
    return document || null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
