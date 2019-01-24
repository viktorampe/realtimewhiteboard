import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonBadgeComponent } from '../../person-badge/person-badge.component';
import { PersonInitialsPipe } from '../../person-badge/pipes/person-initials.pipe';
import { HumanDateTimePipe } from '../../utils/pipes/human-date-time/human-date-time.pipe';
import { NotificationDropdownItemComponent } from './../notification-dropdown-item.component';
import { DropdownDirective } from './notification-dropdown.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <campus-notification-dropdown-item dropdown
      >tekst</campus-notification-dropdown-item
    >
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [
    TestContainerComponent,
    NotificationDropdownItemComponent,
    PersonBadgeComponent,
    HumanDateTimePipe,
    PersonInitialsPipe,
    DropdownDirective
  ],
  imports: [CommonModule, RouterTestingModule, MatIconModule],
  exports: [
    TestContainerComponent,
    NotificationDropdownItemComponent,
    RouterTestingModule,
    PersonBadgeComponent,
    HumanDateTimePipe,
    PersonInitialsPipe,
    DropdownDirective
  ]
})
export class TestModule {}

describe('BorderDirective', () => {
  let directive: DropdownDirective;
  let component: NotificationDropdownItemComponent;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    componentDE = testContainerFixture.debugElement.query(
      By.css('campus-notification-dropdown-item')
    );
    component = componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(DropdownDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should apply the correct class', () => {
    expect(componentDE.nativeElement.classList).toContain(
      'ui-notification-dropdown-item--dropdown'
    );
  });
});
