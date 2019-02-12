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
    let link = alert.link;
    //todo clean up once API changed URLs
    if (link.match(new RegExp('.*.polpo.(localhost|be)(.*)/#/(.*)', 'i'))) {
      link = link.replace('/#/', '/');
    }
    return {
      id: alert.id,
      titleText: alert.title,
      read: alert.read,
      accented: alert.type === 'marketing',
      icon: alert.type,
      link: link,
      notificationText: alert.message,
      notificationDate: new Date(alert.sentAt)
    };
  }
}
