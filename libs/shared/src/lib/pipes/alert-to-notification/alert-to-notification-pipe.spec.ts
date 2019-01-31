import { AlertFixture } from '@campus/dal';
import { AlertToNotificationItemPipe } from './alert-to-notification-pipe';

describe('AlertToNotificationItemPipe', () => {
  it('create an instance', () => {
    const pipe = new AlertToNotificationItemPipe();
    expect(pipe).toBeTruthy();
  });

  it('should get the correct badge', () => {
    const alert = new AlertFixture({ sentAt: new Date() });
    const pipe = new AlertToNotificationItemPipe();
    const expected = {
      titleText: 'Er is een bundel aangepast.',
      read: false,
      accented: false,
      icon: 'bundle',
      link: '/linknaarbundle',
      notificationText: undefined,
      notificationDate: new Date(alert.sentAt)
    };

    expect(pipe.transform(alert)).toEqual(expected);
  });

  it('should sanitize angular js link', () => {
    const alert = new AlertFixture({
      sentAt: new Date(),
      link: '/#/linknaarbundle'
    });
    const pipe = new AlertToNotificationItemPipe();
    const expected = {
      titleText: 'Er is een bundel aangepast.',
      read: false,
      accented: false,
      icon: 'bundle',
      link: '/linknaarbundle',
      notificationText: undefined,
      notificationDate: new Date(alert.sentAt)
    };

    expect(pipe.transform(alert)).toEqual(expected);
  });
});
