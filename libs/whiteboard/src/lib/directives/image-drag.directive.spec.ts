import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { WhiteboardModule } from '../whiteboard.module';
import { ImageDragDirective } from './image-drag.directive';
// file.only
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div campusImageDrag></div>
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
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(ImageDragDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply the correct classes on dragging files over', () => {
    directive.onDragOver(new Event('dragover'));

    testContainerFixture.detectChanges();

    expect(componentDE.nativeElement.classList).toContain(
      'image-drag-directive-dragging'
    );
  });

  it('should remove the class on dragleave', () => {
    directive.onDragOver(new Event('dragover'));

    testContainerFixture.detectChanges();

    directive.onDragLeave(new Event('dragleave'));

    testContainerFixture.detectChanges();

    expect(
      componentDE.nativeElement.classList.contains(
        'image-drag-directive-dragging'
      )
    ).toBeFalsy();
  });

  it('should remove the class on dropping files', () => {
    directive.onDragOver(new Event('dragover'));

    testContainerFixture.detectChanges();

    const file = new File([''], 'dummy.jpg');
    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file, file, file] }
    };

    directive.ondrop(fileDropEvent);

    testContainerFixture.detectChanges();

    expect(
      componentDE.nativeElement.classList.contains(
        'image-drag-directive-dragging'
      )
    ).toBeFalsy();
  });

  it('should emit the event on dropping files', () => {
    spyOn(directive.filesDroppedEvent, 'emit');

    const file = new File([''], 'dummy.jpg');
    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file, file, file] }
    };

    directive.ondrop(fileDropEvent);

    expect(directive.filesDroppedEvent.emit).toHaveBeenCalledTimes(1);
    expect(directive.filesDroppedEvent.emit).toHaveBeenCalledWith(
      fileDropEvent
    );
  });
});
