import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css'
})
export class MessageEdit {
    @ViewChild('subject') subject: ElementRef;
    @ViewChild('msgText') msgText: ElementRef;
    @Output() addMessageEvent = new EventEmitter<Message>();
    currentSender: string = 'Your Name'; // Placeholder

    onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;

    const newMessage = new Message(
      '1', // hardcoding.. should this reference an incrememnting number?
      subjectValue,
      msgTextValue,
      this.currentSender
    );

    this.addMessageEvent.emit(newMessage);
    // this.onClear(); // Clearing from after sending it because it's nicer
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
