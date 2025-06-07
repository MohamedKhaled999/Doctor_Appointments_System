import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection;
  private notificationSubject = new Subject<string>();
  constructor() { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/notificationHub') // Adjust the URL as needed
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection established'))
      .catch(err => console.error('Error establishing SignalR connection:', err));

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationSubject.next(message);
    });
    this.hubConnection.onclose(() => {
      console.error('SignalR connection closed. Attempting to reconnect...');
      setTimeout(() => this.hubConnection.start(), 5000);
    });
  }
}
