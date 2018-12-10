import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMatIconRegistry } from '@campus/testing';
import { PersonBadgeComponent } from '../person-badge/person-badge.component';
import { PersonInitialsPipe } from '../person-badge/pipes/person-initials.pipe';
import { HumanDateTimePipe } from '../utils/pipes/human-date-time/human-date-time.pipe';
import { NotificationDropdownItemComponent } from './notification-dropdown-item.component';

describe('NotificationDropdownItemComponent', () => {
  let component: NotificationDropdownItemComponent;
  let fixture: ComponentFixture<NotificationDropdownItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatIconModule],
      declarations: [
        NotificationDropdownItemComponent,
        PersonBadgeComponent,
        PersonInitialsPipe,
        HumanDateTimePipe
      ],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDropdownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show an icon', () => {
    component.icon = null;
    fixture.detectChanges();

    const iconNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__icon')
    );
    expect(iconNode).toBeNull();
  });

  it('should show an icon', () => {
    component.icon = 'foo';
    fixture.detectChanges();

    const iconNode = fixture.debugElement.query(
      By.css('mat-icon.ui-notification-dropdown-item__icon')
    );
    expect(iconNode.nativeElement.getAttribute(['ng-reflect-svg-icon'])).toBe(
      'foo'
    );
    expect(iconNode).toBeTruthy();
  });

  it('should show user badge', () => {
    component.person = {
      displayName: 'foo bar',
      name: 'foo',
      firstName: 'bar',
      avatar: null
    };
    fixture.detectChanges();

    const badgeNode = fixture.debugElement.query(By.css('campus-person-badge'));
    expect(badgeNode).toBeTruthy();
  });

  it('should not show a title', () => {
    component.titleText = null;
    fixture.detectChanges();

    const textNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__title')
    );
    expect(textNode).toBeNull();
  });

  it('should show a title', () => {
    component.titleText = 'foo';
    fixture.detectChanges();

    const textNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__title')
    );
    expect(textNode).toBeTruthy();
    expect(textNode.nativeElement.textContent).toContain('foo');
  });

  it('should not show a description', () => {
    component.notificationText = null;
    fixture.detectChanges();

    const textNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__text')
    );
    expect(textNode.nativeElement.textContent.trim()).toBe('');
  });

  it('should show a description', () => {
    component.notificationText = 'foo';
    fixture.detectChanges();

    const textNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__text')
    );
    expect(textNode).toBeTruthy();
    expect(textNode.nativeElement.textContent).toContain('foo');
  });

  it('should show a link if `accented=true`', () => {
    component.accented = true;
    fixture.detectChanges();

    const textNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__text > span')
    );
    expect(textNode).toBeNull();
  });

  it('should not show a link if `accented=false`', () => {
    component.accented = false;
    fixture.detectChanges();

    const textNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__text > span')
    );
    expect(textNode).toBeNull();
  });

  it('should show the notification date', () => {
    // human readable with humanDateTime pipe
    component.notificationDate = new Date();
    fixture.detectChanges();

    const dateNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__date')
    );
    expect(dateNode).toBeTruthy();
    expect(dateNode.nativeElement.textContent).toContain('zonet');
  });

  it('should not show the notification date', () => {
    component.notificationDate = null;
    fixture.detectChanges();

    const dateNode = fixture.debugElement.query(
      By.css('.ui-notification-dropdown-item__date')
    );
    expect(dateNode).toBeNull();
  });
});
