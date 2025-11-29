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
    this.http.get<Document[]>('http://localhost:3000/documents')
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

  // storeDocuments() {
  //   const documents = JSON.stringify(this.documents);
  //   const headers = new HttpHeaders({'Content-Type': 'application/json'});

  //   this.http.put('https://wdd430-cms-fc829-default-rtdb.firebaseio.com/documents.json', documents, {headers: headers})
  //     .subscribe({
  //       next: () => {
  //         this.documentListChangedEvent.next(this.documents.slice());
  //       },
  //       error: (error: any) => {
  //          console.error(error);
  //       }
  //     });
  // }

  addDocument(document: Document) {
    if (!document) return;
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents', document, { headers: headers })
      .subscribe({
        next: (responseData) => {
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/documents/' + originalDocument.id, newDocument, { headers: headers })
      .subscribe({
        next: (response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      });
  }

  getDocument(id: string): Document | null {
    const document = this.documents.find(doc => doc.id === id);
    return document || null;
  }

  deleteDocument(document: Document) {
    if (!document) return;
    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) return;

    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe({
        next: (response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      });
  }

  // Helper
  sortAndSend() {
     this.documents.sort((a, b) => a.name.localeCompare(b.name));
     this.documentListChangedEvent.next(this.documents.slice());
  }
}
