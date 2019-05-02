import { AlertFixture } from '@campus/dal';
import { AlertToNotificationItemPipe } from './alert-to-notification-pipe';

describe('AlertToNotificationItemPipe', () => {
  it('create an instance', () => {
    const pipe = new AlertToNotificationItemPipe();
    expect(pipe).toBeTruthy();
  });

  it('should get the correct badge', () => {
    const alert = new AlertFixture({
      sentAt: new Date(),
      message: 'bloe',
      type: 'bundle'
    });
    const pipe = new AlertToNotificationItemPipe();
    const expected = {
      id: 1,
      titleText: 'Er is een bundel aangepast.',
      read: false,
      accented: false,
      icon: 'educontent',
      link: '/linknaarbundle',
      notificationText: 'bloe',
      notificationDate: new Date(alert.sentAt)
    };

    expect(pipe.transform(alert)).toEqual(expected);
  });

  it('should sanitize angular js link', () => {
    const alert = new AlertFixture({
      sentAt: new Date(),
      link: 'http://www.polpo.be/#/linknaarbundle',
      message: 'wortel'
    });
    const pipe = new AlertToNotificationItemPipe();
    const expected = {
      id: 1,
      titleText: 'Er is een bundel aangepast.',
      read: false,
      accented: false,
      icon: 'educontent',
      link: 'http://www.polpo.be/linknaarbundle',
      notificationText: 'wortel',
      notificationDate: new Date(alert.sentAt)
    };

    expect(pipe.transform(alert)).toEqual(expected);
  });
});
