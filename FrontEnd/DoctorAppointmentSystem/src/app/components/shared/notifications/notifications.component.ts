import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/interfaces/notification.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  displayedNotifications: any[] = [];
  newNotificationsCount: number = 0;
  private subscription: Subscription = new Subscription();
  panelOpen = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data: any) => {
        this.notifications = data;
        this.notifications.reverse();
        this.newNotificationsCount = this.notifications.filter(notification => !notification.isRead).length;
        this.displayedNotifications = this.notifications.slice(0, 5);
        console.log('Initial notifications:', this.notifications, this.displayedNotifications);
        this.subscription.add(
          this.notificationService.notifications$.subscribe({
            next: (data) => {
              if (data !== null) {
                this.notifications.unshift(data);
              }
            },
            error: (error) => {
              console.error('Error loading notifications:', error);
            }
          })
        );
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  markAsRead(): void {
    this.displayedNotifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        this.notificationService.markAsRead(notification.id).subscribe();
      }
    });
    this.newNotificationsCount = 0;
  }

  toggle() {
    this.panelOpen = !this.panelOpen;
    if (this.panelOpen) {
      this.markAsRead();
    }
  }
  loadMore(): void {
    this.displayedNotifications = this.notifications.slice(0, this.displayedNotifications.length + 5);
    this.markAsRead();
  }
}
