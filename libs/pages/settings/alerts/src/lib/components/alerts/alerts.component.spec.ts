import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiModule } from '@campus/ui';
import { AlertsComponent } from './alerts.component';
import { AlertsViewModel } from './alerts.viewmodel';
import { MockAlertsViewModel } from './alerts.viewmodel.mock';
// file.only
describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let viewModel: AlertsViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [AlertsComponent],
      providers: [{ provide: AlertsViewModel, useClass: MockAlertsViewModel }]
    }).compileComponents();
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
      expect(component.alerts$).toBeDefined();
    });
  });
  describe('user actions', () => {
    it('call the viewmodel.setAlertAsRead', () => {
      const alertId = 5;
      viewModel.setAlertAsRead = jest.fn();
      component.setAlertAsRead(alertId);

      expect(viewModel.setAlertAsRead).toHaveBeenCalledTimes(1);
      expect(viewModel.setAlertAsRead).toHaveBeenCalledWith(alertId);
    });
    it('call the viewmodel.setAlertAsRead', () => {
      const alertId = 6;
      viewModel.setAlertAsUnread = jest.fn();
      component.setAlertAsUnread(alertId);

      expect(viewModel.setAlertAsUnread).toHaveBeenCalledTimes(1);
      expect(viewModel.setAlertAsUnread).toHaveBeenCalledWith(alertId);
    });
    it('call the viewmodel.removeAlert', () => {
      const alertId = 2;
      viewModel.removeAlert = jest.fn();
      component.removeAlert(alertId);

      expect(viewModel.removeAlert).toHaveBeenCalledTimes(1);
      expect(viewModel.removeAlert).toHaveBeenCalledWith(alertId);
    });
  });
});
