import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertToNotificationItemPipe,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { NotificationItemInterface, UiModule } from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { AlertsComponent } from './alerts.component';
import { AlertsViewModel } from './alerts.viewmodel';
import { MockAlertsViewModel } from './alerts.viewmodel.mock';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let viewModel: AlertsViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, MatIconModule, SharedModule],
      declarations: [AlertsComponent],
      providers: [
        { provide: AlertsViewModel, useClass: MockAlertsViewModel },
        AlertToNotificationItemPipe,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(AlertsViewModel);
    fixture.detectChanges();
  });
  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialise the streams', () => {
      expect(component.notifications$).toBeDefined();
    });
  });
  describe('user actions', () => {
    it('should call the viewmodel.setAlertAsRead', () => {
      const alertId = 5;
      viewModel.setAlertAsRead = jest.fn();
      component.setAlertAsRead(alertId);

      expect(viewModel.setAlertAsRead).toHaveBeenCalledTimes(1);
      expect(viewModel.setAlertAsRead).toHaveBeenCalledWith(alertId);
    });
    it('should call the viewmodel.setAlertAsUnRead', () => {
      const alertId = 6;
      viewModel.setAlertAsUnread = jest.fn();
      component.setAlertAsUnread(alertId);

      expect(viewModel.setAlertAsUnread).toHaveBeenCalledTimes(1);
      expect(viewModel.setAlertAsUnread).toHaveBeenCalledWith(alertId);
    });
    it('should call the viewmodel.removeAlert', () => {
      const alertId = 2;
      viewModel.removeAlert = jest.fn();
      component.removeAlert(alertId);

      expect(viewModel.removeAlert).toHaveBeenCalledTimes(1);
      expect(viewModel.removeAlert).toHaveBeenCalledWith(alertId);
    });
    it('should call setAlertAsRead if the alert.read is false', () => {
      const readSpy = jest
        .spyOn(component, 'setAlertAsRead')
        .mockImplementation(() => {});
      const unreadSpy = jest
        .spyOn(component, 'setAlertAsUnread')
        .mockImplementation(() => {});
      component.notifications$ = new BehaviorSubject<
        NotificationItemInterface[]
      >([
        {
          id: 100,
          icon: 'icon',
          titleText: 'title',
          link: '',
          notificationText: 'notification text',
          notificationDate: new Date(),
          read: false
        }
      ]);
      fixture.detectChanges();
      const readIcon = fixture.debugElement.query(
        By.css(
          '.pages-settings-alerts__info-panel__notification__actions__read'
        )
      );
      readIcon.nativeElement.click();
      expect(readSpy).toHaveBeenCalledWith(100);
      expect(unreadSpy).not.toHaveBeenCalled();
    });
    it('should call setAlertAsRead if the alert.read is true', () => {
      const readSpy = jest
        .spyOn(component, 'setAlertAsRead')
        .mockImplementation(() => {});
      const unreadSpy = jest
        .spyOn(component, 'setAlertAsUnread')
        .mockImplementation(() => {});
      component.notifications$ = new BehaviorSubject<
        NotificationItemInterface[]
      >([
        {
          id: 100,
          icon: 'icon',
          titleText: 'title',
          link: '',
          notificationText: 'notification text',
          notificationDate: new Date(),
          read: true
        }
      ]);
      fixture.detectChanges();
      const readIcon = fixture.debugElement.query(
        By.css(
          '.pages-settings-alerts__info-panel__notification__actions__read'
        )
      );
      readIcon.nativeElement.click();
      expect(unreadSpy).toHaveBeenCalledWith(100);
      expect(readSpy).not.toHaveBeenCalled();
    });
  });
});
