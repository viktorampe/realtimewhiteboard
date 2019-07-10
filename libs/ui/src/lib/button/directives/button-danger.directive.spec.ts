import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { ButtonComponent } from '../button.component';
import { DangerDirective } from './button-danger.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <campus-button danger>tekst</campus-button>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('DangerDirective', () => {
  let directive: DangerDirective;
  let component: ButtonComponent;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });
  });

  beforeEach(() => {
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    componentDE = testContainerFixture.debugElement.query(
      By.css('campus-button')
    );
    component = <ButtonComponent>componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(DangerDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should apply the correct class', () => {
    expect(componentDE.nativeElement.classList).toContain('ui-button--danger');
  });
});
