import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { ImageDragDirective } from './image-drag.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div campusImageDrag></div>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent, ImageDragDirective],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('ImageDragDirective', () => {
  let directive: ImageDragDirective;
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
    componentDE = testContainerFixture.debugElement.query(By.css('div'));
    directive = componentDE.injector.get(ImageDragDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
