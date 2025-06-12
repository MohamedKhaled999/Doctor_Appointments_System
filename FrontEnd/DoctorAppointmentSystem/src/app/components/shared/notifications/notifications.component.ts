import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/interfaces/notification.interface';
import { CommonModule } from '@angular/common';
import { NotificationEvents } from '../../../core/enums/notificationEvents.enum';

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
  toggleOpened = false;
  showShowMoreButton = false;

  constructor(private notificationService: NotificationService) { }

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
        this.showShowMoreButton = this.notifications.length > 5;
        this.subscription.add(
          this.notificationService.notifications$.subscribe({
            next: (data) => {
              if (data !== null) {
                this.notifications.unshift(data);
                this.newNotificationsCount++;
                this.displayedNotifications = this.notifications.slice(0, 5);
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
      this.toggleOpened = true;
    } else if (this.toggleOpened) {
      this.toggleOpened = false;
      this.markAsRead();
    }
  }
  loadMore(): void {
    this.displayedNotifications = this.notifications.slice(0, this.displayedNotifications.length + 5);
    this.showShowMoreButton = this.notifications.length > this.displayedNotifications.length;
    this.markAsRead();
  }
  getNotificationEentType(eventType: number): string {
    switch (eventType) {
      case NotificationEvents.Doctor_MaximumAppointmentsReached:
        return 'Maximum Appointments Reached';
      case NotificationEvents.Doctor_ReservationAdded:
        return 'Reservation Added';
      case NotificationEvents.Doctor_ReservationCanceled:
        return 'Reservation Canceled';
      case NotificationEvents.Doctor_Approved:
        return 'Account Approved';
      case NotificationEvents.Patient_AppointmentAdded:
        return 'Appointment Added';
      case NotificationEvents.Patient_AppointmentCanceled:
        return 'Appointment Canceled';
      case NotificationEvents.Patient_AppointmentReminder:
        return 'Appointment Reminder';
      case NotificationEvents.Patient_AppointmentRescheduled:
        return 'Appointment Rescheduled';
      default:
        return 'Unknown Event';
    }
  }
  getNotificationTimeAgo(timeStamp: string): string {
    const now = new Date();
    const notificationDate = new Date(timeStamp);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  }
}
