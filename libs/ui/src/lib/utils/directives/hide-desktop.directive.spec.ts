import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  DebugElement,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { Subject } from 'rxjs';
import { HideDesktopDirective } from './hide-desktop.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div hide-desktop>tekst</div>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent],
  providers: [BreakpointObserver]
})
export class TestModule {}

describe('HideDesktopDirective', () => {
  let component: Component;
  let directive: HideDesktopDirective;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;
  const breakpointStream: Subject<BreakpointState> = new Subject();
  let testbed;

  configureTestSuite(() => {
    testbed = TestBed.configureTestingModule({
      imports: [TestModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    const breakpointObserver: BreakpointObserver = testbed.get(
      BreakpointObserver
    );
    jest.spyOn(breakpointObserver, 'observe').mockReturnValue(breakpointStream);
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    componentDE = testContainerFixture.debugElement.query(By.css('div'));
    component = componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(HideDesktopDirective);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should apply the correct attribute based on the BreakpointObserver', () => {
    const isMobileBreakpoint = true;

    breakpointStream.next({ matches: !isMobileBreakpoint, breakpoints: {} });
    testContainerFixture.detectChanges();

    expect(componentDE.nativeElement.style.display).toBe('none');

    breakpointStream.next({ matches: isMobileBreakpoint, breakpoints: {} });
    testContainerFixture.detectChanges();

    expect(componentDE.nativeElement.style.display).not.toBe('none');
  });
});
