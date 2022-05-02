import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'
import { chatMesage } from '../Model/chatMesage';
import { MessageForCreationDto } from '../Model/Message/MessageForCreationDto';
import { JobMessages } from '../Model/Message/JobMessages';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection
  public messages: MessageForCreationDto[] = [];
  private connectionUrl = 'https://hoozonline.com/signalr';

  constructor(private http: HttpClient) { }

  public connect = () => {
    this.startConnection();
    this.addListeners();
  }

  // Message user to User
  public sendMessageToApi(userid:number, message:MessageForCreationDto) {
    return this.http.post(environment.api_url+'Message/Send/'+userid, this.buildChatMessage(message))
      .pipe(tap(_ => console.log(this.messages)));
  }

  // Message to Job
  public sendMessageToJobApi(jobId:number,recipientId:number,senderId:number, message:JobMessages) {
    return this.http.post(environment.api_url+'Message/JobChat/'+jobId+'/'+recipientId+'/'+senderId, this.buildJobChatMessage(message))
      .pipe(tap(_ => console.log(this.messages)));
  }

  public sendMessageToHub(message: MessageForCreationDto) {
    var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message))
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }

  private getConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(this.connectionUrl)
      .withHubProtocol(new MessagePackHubProtocol())
      //  .configureLogging(LogLevel.Trace)
      .build();
  }

  private buildChatMessage(message: MessageForCreationDto): MessageForCreationDto {
    return {
      SenderId: message.SenderId,
      RecipientId:message.RecipientId,
      Content: message.Content,
      RecipientContent:null,
      SenderContent:message.Content
    };
  }

  private buildJobChatMessage(message: JobMessages): JobMessages {
    return {
      JobId:message.JobId,
      SenderId: message.SenderId,
      RecipientId: message.RecipientId,
      Content: message.Content,
    };
  }

  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err))
  }

  private addListeners() {
    this.hubConnection.on(
      "messageReceivedFromApi",
      (data: MessageForCreationDto) => {

      }
    );
    this.hubConnection.on("messageReceivedFromHub", (data: MessageForCreationDto) => {
      console.log("message received from Hub")
      this.messages.push(data);
    })
    this.hubConnection.on("newUserConnected", _ => {
      console.log("new user connected")
    })
  }
}



