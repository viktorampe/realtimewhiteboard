import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationDropdownItemComponent } from './notification-dropdown-item.component';

xdescribe('NotificationDropdownItemComponent', () => {
  let component: NotificationDropdownItemComponent;
  let fixture: ComponentFixture<NotificationDropdownItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationDropdownItemComponent]
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

  it('should should show the users avatar, if provided', () => {});

  it('should should show the users initials, if provided AND no avatar is provided', () => {});

  it('should should show an icon, if provided AND no avatar or initials are provided', () => {});

  it('should should show a title, if provided', () => {});

  it('should should show a title as a link, if both text and url are provided', () => {});

  it('should should show the notification date in a human readable format', () => {});
});
