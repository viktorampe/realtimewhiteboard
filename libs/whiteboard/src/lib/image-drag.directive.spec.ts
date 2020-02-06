import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ImageDragDirective } from './image-drag.directive';
import { WhiteboardModule } from './whiteboard.module';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <campus-whiteboard campusImageDrag></campus-whiteboard>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, WhiteboardModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('ImageDragDirective', () => {
  let directive: ImageDragDirective;
  let component: WhiteboardComponent;
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
    component = <WhiteboardComponent>componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(ImageDragDirective);
  });

  it('should create an instance', () => {
    expect(Component).toBeTruthy();
    expect(directive).toBeTruthy();
  });
});
