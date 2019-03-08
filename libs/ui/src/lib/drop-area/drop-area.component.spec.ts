import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DropAreaComponent } from './drop-area.component';

describe('DropAreaComponent', () => {
  let component: DropAreaComponent;
  let fixture: ComponentFixture<DropAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [DropAreaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not show the icon container if icon is not given', () => {
    expect(
      fixture.debugElement.query(By.css('.ui-drop-area__icon-container'))
    ).toBeFalsy();
  });
  it('should show the icon container and correct icon if icon is given', () => {
    const icon = 'add';
    component.icon = icon;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.ui-drop-area__icon-container'))
    ).toBeTruthy();
    expect(
      fixture.debugElement
        .query(By.css('mat-icon'))
        .nativeElement.getAttribute('ng-reflect-svg-icon')
    ).toBe(icon);
  });
  it('should show empty message if message is not given', () => {
    expect(
      fixture.debugElement.query(By.css('.ui-drop-area__message')).nativeElement
        .textContent
    ).toBe('');
  });
  it('should show the message if message is given', () => {
    const message = 'this is the message that will be displayed';
    component.message = message;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.ui-drop-area__message')).nativeElement
        .textContent
    ).toBe(message);
  });
  it('should add the dragOverClassName when dragging over', () => {
    component.dragOverClassName = 'some-classname';
    const element = fixture.debugElement.query(By.css('.ui-drop-area'));
    element.nativeElement.dispatchEvent(new Event('dragenter', null));
    fixture.detectChanges();
    expect(component.dragging).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.some-classname'))).toBeTruthy();
    element.nativeElement.dispatchEvent(new Event('dragleave', null));
    fixture.detectChanges();
    expect(component.dragging).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.some-classname'))).toBeFalsy();
  });
});
