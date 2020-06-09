import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { UiModule } from '../ui.module';
import { SectionComponent, SectionModeEnum } from './section.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <campus-section withTitle>
      <section-title>title</section-title>
      <section-actions>action</section-actions>
      <section-content>content</section-content>
    </campus-section>
    <campus-section withoutTitle>
      <section-actions>action</section-actions>
      <section-content>content</section-content>
    </campus-section>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let actionClickSpy: jest.SpyInstance;
  let modeChangeSpy: jest.SpyInstance;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    actionClickSpy = jest.spyOn(component.actionClick, 'emit');
    modeChangeSpy = jest.spyOn(component.modeChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickSection()', () => {
    it('should trigger the modeChange output when in editable mode', () => {
      component.mode = SectionModeEnum.EDITABLE;
      component.clickSection();

      expect(modeChangeSpy).toHaveBeenCalledWith(SectionModeEnum.EDITING);
    });

    it('should not trigger the modeChange output when not in editable mode', () => {
      const nonTriggerModes = [SectionModeEnum.EDITING, SectionModeEnum.STATIC];
      nonTriggerModes.forEach(mode => {
        component.mode = mode;
        component.clickSection();
        expect(modeChangeSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('clickAction()', () => {
    const mockMouseEvent = { stopPropagation: () => {} } as MouseEvent;
    it('should trigger the modeChange output when in editable mode', () => {
      component.mode = SectionModeEnum.EDITABLE;
      component.clickAction(mockMouseEvent);

      expect(modeChangeSpy).toHaveBeenCalledWith(SectionModeEnum.EDITING);
      expect(actionClickSpy).not.toHaveBeenCalled();
    });

    it('should trigger the actionClick output when  in static mode', () => {
      component.mode = SectionModeEnum.STATIC;
      component.clickAction(mockMouseEvent);

      expect(actionClickSpy).toHaveBeenCalled();
      expect(modeChangeSpy).not.toHaveBeenCalled();
    });

    it('should not trigger anything when  in editing mode', () => {
      component.mode = SectionModeEnum.EDITING;
      component.clickAction(mockMouseEvent);

      expect(actionClickSpy).not.toHaveBeenCalled();
      expect(modeChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('sectionTitle', () => {
    let containerFixture: ComponentFixture<TestContainerComponent>;
    let sections: DebugElement[];
    beforeEach(() => {
      containerFixture = TestBed.createComponent(TestContainerComponent);
      containerFixture.detectChanges();
      sections = containerFixture.debugElement.queryAll(
        By.directive(SectionComponent)
      );
    });

    it('should show the header when a section-title is added to the template', () => {
      const header = sections[0].query(By.css('.ui-section__header'));
      expect(header).not.toBeNull();
    });

    it('should remove the header when there is no section-title added to the template', () => {
      const header = sections[1].query(By.css('.ui-section__header'));
      expect(header).toBeNull();
    });
  });
});
