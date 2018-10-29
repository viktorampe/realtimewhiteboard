import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { VisibleDirective } from './action-visible.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div action-visible>tekst</div>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('VisibleDirective', () => {
  let directive: VisibleDirective;
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
    componentDE = testContainerFixture.debugElement.query(By.css('div'));
    testContainerFixture.detectChanges();

    directive = componentDE.injector.get(VisibleDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(componentDE).toBeTruthy();
    expect(directive).toBeTruthy();
  });
});
