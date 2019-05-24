import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { CollapsibleSheetComponent } from './collapsible-sheet.component';

describe('CollapsibleSheetComponent', () => {
  let component: CollapsibleSheetComponent;
  let fixture: ComponentFixture<CollapsibleSheetComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, NoopAnimationsModule],
      declarations: [CollapsibleSheetComponent]
      // Not usable in this test suite -> actual MatIcon is needed, MockMatIconRegistry returns null
      // providers: [{ provide: MatIconRegistry, useValue: MockMatIconRegistry }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('collapseExpandState', () => {
    it('should return *-closed or *-open if collapsed is respectively true or false', () => {
      [true, false].forEach(value => {
        component.collapsed = value;
        fixture.detectChanges();
        expect(
          component
            .collapseExpandState()
            .split('-')
            .pop()
        ).toBe(value ? 'closed' : 'open');
      });
    });
  });

  describe('breakpoints', () => {
    it('should extend defaults with provided values', () => {
      component.breakpoints = { 'large-closed': 'foo', 'large-open': 'bar' };
      expect(component.breakpoints).toEqual({
        'xsmall-closed': '5%',
        'xsmall-open': '95%',
        'small-closed': '15%',
        'small-open': '50%',
        'medium-closed': '15%',
        'medium-open': '40%',
        'large-closed': 'foo',
        'large-open': 'bar'
      });
    });
  });
});
