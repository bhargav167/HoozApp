import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr'
import { Observable, Subject } from 'rxjs';
import { RealChatDtos } from '../Model/Message/RealChatDtos';
import { tap } from 'rxjs/operators';
import { JobMessages } from '../Model/Message/JobMessages';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private  connection: any = new HubConnectionBuilder()
  .withUrl(environment.hubConnectionURL, {
           skipNegotiation: true,
           transport:  HttpTransportType.WebSockets
         })
         .build();
readonly POST_URL = environment.broadcastURL;
readonly JobPOST_URL = environment.broadcastJobURL;

private receivedMessageObject: RealChatDtos = new RealChatDtos();
private sharedObj = new Subject<RealChatDtos>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
   this.connection.on("ReceiveOne", (data:RealChatDtos) => {   this.mapReceivedMessage(data); });
   this.start();
  }
// Strart the connection
public async start() {
  try {
    await this.connection.start();
    console.log("connected");
  } catch (err) {
    console.log(err);
    setTimeout(() => this.start(), 5000);
  }
}

public mapReceivedMessage(user: RealChatDtos): void {
  this.receivedMessageObject.SenderId = user.SenderId;
  this.receivedMessageObject.RecipientId = user.RecipientId;
  this.receivedMessageObject.Content = user.Content;
  this.receivedMessageObject.RecipientContent = user.RecipientContent;
  this.receivedMessageObject.SenderContent = user.SenderContent;
  this.sharedObj.next(this.receivedMessageObject);
}

/* ****************************** Public Mehods **************************************** */

  // Calls the controller method
  public broadcastMessage(msgDto: RealChatDtos) {
    this.http.post(this.POST_URL, msgDto).subscribe(data => {});
   // this.connection.invoke("ReceiveOne",msgDto).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  public broadcastJobMessage(msgDto: JobMessages) {
    this.http.post(this.JobPOST_URL, msgDto).subscribe(data => {});
   // this.connection.invoke("ReceiveOne",msgDto).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  public retrieveMappedObject(): Observable<RealChatDtos> {

    return this.sharedObj.asObservable();
  }

  // public connect = () => {
  //   this.startConnection();
  //   this.addListeners();
  // }

  // // Message user to User
   public sendMessageToApi(userid:number, message:RealChatDtos) {
     return this.http.post(environment.api_url+'Message/Send/'+userid,message)
       .pipe(tap(_ => {}));
   }

  // // Message to Job
  public sendMessageToJobApi(jobId:number,recipientId:number,senderId:number, message:JobMessages) {
    return this.http.post(environment.api_url+'Message/JobChat/'+jobId+'/'+recipientId+'/'+senderId, message)
      .pipe(tap(_ => console.log()));
  }

  // public sendMessageToHub(message: MessageForCreationDto) {
  //   var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message))
  //     .then(() => { console.log('message sent successfully to hub'); })
  //     .catch((err) => console.log('error while sending a message to hub: ' + err));

  //   return from(promise);
  // }

  // private getConnection(): HubConnection {
  //   return new HubConnectionBuilder().withHubProtocol(new MessagePackHubProtocol())
  //      .configureLogging(LogLevel.Trace).withUrl(this.connectionUrl, {
  //       skipNegotiation: true,
  //       transport:  HttpTransportType.WebSockets
  //     })
  //     .build();
  // }

  // private buildChatMessage(message: MessageForCreationDto): MessageForCreationDto {
  //   return {
  //     SenderId: message.SenderId,
  //     RecipientId:message.RecipientId,
  //     Content: message.Content,
  //     RecipientContent:null,
  //     SenderContent:message.Content
  //   };
  // }

  // private buildJobChatMessage(message: JobMessages): JobMessages {
  //   return {
  //     JobId:message.JobId,
  //     SenderId: message.SenderId,
  //     RecipientId: message.RecipientId,
  //     Content: message.Content,
  //   };
  // }

  // private startConnection() {
  //   this.hubConnection = this.getConnection();
  //   this.hubConnection.start()
  //     .then(() => console.log('connection started'))
  //     .catch((err) => console.log('error while establishing signalr connection: ' + err))
  // }

  // private addListeners() {
  //   this.hubConnection.on(
  //     "messageReceivedFromApi",
  //     (data: MessageForCreationDto) => {
  //       this.messages.push(data);
  //     }
  //   );
  //   this.hubConnection.on("messageReceivedFromHub", (data: MessageForCreationDto) => {
  //     console.log("message received from Hub")

  //   })
  //   this.hubConnection.on("newUserConnected", _ => {
  //     console.log("new user connected")
  //   })
  // }
}



