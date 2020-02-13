import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { SectionComponent, SectionModeEnum } from './section.component';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let actionClickSpy: jest.SpyInstance;
  let modeChangeSpy: jest.SpyInstance;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SectionComponent]
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
    it('should trigger an emit when in editable mode', () => {
      component.mode = SectionModeEnum.EDITABLE;
      component.clickSection();

      expect(modeChangeSpy).toHaveBeenCalledWith(SectionModeEnum.EDITING);
    });

    it('should not trigger an emit when not in editable mode', () => {
      component.mode = SectionModeEnum.EDITING;
      component.clickSection();
      expect(modeChangeSpy).not.toHaveBeenCalled();
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
  });
});
