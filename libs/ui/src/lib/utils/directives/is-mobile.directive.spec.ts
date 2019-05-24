import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { Subject } from 'rxjs';
import { IsMobileDirective } from './is-mobile.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div is-mobile>tekst</div>
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

describe('HideMobileDirective', () => {
  let component: Component;
  let directive: IsMobileDirective;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;
  const breakpointStream: Subject<{
    matches: boolean;
    breakpoints: {};
  }> = new Subject();
  let testbed;

  configureTestSuite(() => {
    testbed = TestBed.configureTestingModule({
      imports: [TestModule]
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
    directive = componentDE.injector.get(IsMobileDirective);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should apply the correct attribute based on the BreakpointObserver', () => {
    const isMobileBreakpoint = true;

    breakpointStream.next({ matches: isMobileBreakpoint, breakpoints: {} });
    testContainerFixture.detectChanges();

    expect(componentDE.nativeElement.classList.toString()).toContain(
      'ui--mobile'
    );

    breakpointStream.next({ matches: !isMobileBreakpoint, breakpoints: {} });
    testContainerFixture.detectChanges();

    expect(componentDE.nativeElement.classList).not.toContain('ui--mobile');
  });
});
