import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { catchError, of, Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private hubConnection: signalR.HubConnection;
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notifications$: Observable<Notification | null> = this.notificationSubject.asObservable();
  constructor(private http: HttpClient) { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doc-net2.runasp.net/hub', {
        accessTokenFactory: () => localStorage.getItem('userToken') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => console.error('Error establishing SignalR connection:', err));

    this.hubConnection.on('newNotification', (notification: string) => {
      let notificationObj: Notification = JSON.parse(notification);
      this.notificationSubject.next(notificationObj);
    });
  }
  ngOnDestroy(): void {
    this.hubConnection.stop();
  }
  public getNotifications(): Observable<Notification | null> {
    return this.http.get<Notification | null>(`${environment.apiUrl}/notifications`).pipe(
      catchError((error) => {
        console.error('Error fetching notifications:', error);
        return of();
      })
    );
  }
  public markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/notifications/mark-as-read?notificationId=${notificationId}`, {}).pipe(
      catchError((error) => {
        console.error('Error marking notification as read:', error);
        return of();
      })
    );
  }
}
