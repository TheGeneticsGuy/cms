import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css'
})
export class MessageEdit implements OnInit {
    @ViewChild('subject') subject: ElementRef;
    @ViewChild('msgText') msgText: ElementRef;
    currentSender: string = 'Your Name'; // Placeholder

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {}

    onSendMessage() {
      const subjectValue = this.subject.nativeElement.value;
      const msgTextValue = this.msgText.nativeElement.value;

      const newMessage = new Message(
        '1', // hardcoding.. should this reference an incrememnting number?
        subjectValue,
        msgTextValue,
        this.currentSender
      );

    this.messageService.addMessage(newMessage);
    this.onClear(); // Clearing from after sending it because it's nicer
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
