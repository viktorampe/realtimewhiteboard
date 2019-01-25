import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonBadgeComponent } from '../../person-badge/person-badge.component';
import { PersonInitialsPipe } from '../../person-badge/pipes/person-initials.pipe';
import { HumanDateTimePipe } from '../../utils/pipes/human-date-time/human-date-time.pipe';
import { NotificationComponent } from './../notification.component';
import { DropdownDirective } from './notification-dropdown.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <campus-notification dropdown>tekst</campus-notification>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [
    TestContainerComponent,
    NotificationComponent,
    PersonBadgeComponent,
    HumanDateTimePipe,
    PersonInitialsPipe,
    DropdownDirective
  ],
  imports: [CommonModule, RouterTestingModule, MatIconModule],
  exports: [
    TestContainerComponent,
    NotificationComponent,
    RouterTestingModule,
    PersonBadgeComponent,
    HumanDateTimePipe,
    PersonInitialsPipe,
    DropdownDirective
  ]
})
export class TestModule {}

describe('DropdownDirective', () => {
  let directive: DropdownDirective;
  let component: NotificationComponent;
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
      By.css('campus-notification')
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
      'ui-notification--dropdown'
    );
  });
});
