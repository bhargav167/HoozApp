import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  text: string = "";
  constructor(public signalRService: SignalrService) { }

  ngOnInit(): void {
    this.signalRService.connect();
  }
  sendMessage(): void {
    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });
  }
}
