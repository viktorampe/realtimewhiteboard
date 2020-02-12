import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { SectionComponent, SectionModeEnum } from './section.component';
// file.only
describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let sectionClickSpy: jest.SpyInstance;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SectionComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sectionClickSpy = jest.spyOn(component.sectionClick, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickSection()', () => {
    it('should trigger an emit when in editable mode', () => {
      component.mode = SectionModeEnum.EDITABLE;
      component.clickSection();
      expect(sectionClickSpy).toHaveBeenCalled();
    });

    it('should not trigger an emit when not in editable mode', () => {
      component.mode = SectionModeEnum.EDITING;
      component.clickSection();
      expect(sectionClickSpy).not.toHaveBeenCalled();
    });
  });
});
