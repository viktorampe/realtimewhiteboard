import { Pipe, PipeTransform } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { NotificationItemInterface } from '@campus/ui';

@Pipe({
  name: 'AlertToNotificationItem'
})
export class AlertToNotificationItemPipe implements PipeTransform {
  /**
   * takes an alert object
   * returns a notification object
   */
  transform(alert: AlertQueueInterface): NotificationItemInterface {
    return {
      titleText: alert.title,
      read: alert.read,
      accented: alert.type === 'marketing',
      icon: alert.type,
      link: alert.link.replace('/#/', '/'), //todo remove when sanitized from API
      notificationText: alert.message,
      notificationDate: new Date(alert.sentAt)
    };
  }
}
