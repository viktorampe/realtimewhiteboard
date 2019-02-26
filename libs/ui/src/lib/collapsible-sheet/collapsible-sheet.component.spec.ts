import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CollapsibleSheetComponent } from './collapsible-sheet.component';

describe('CollapsibleSheetComponent', () => {
  let component: CollapsibleSheetComponent;
  let fixture: ComponentFixture<CollapsibleSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, NoopAnimationsModule],
      declarations: [CollapsibleSheetComponent]
    }).compileComponents();
  }));

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
    it('should return *-true or *-false if collapsed is respectively true or false', () => {
      [true, false].forEach(value => {
        component.collapsed = value;
        fixture.detectChanges();
        expect(
          component
            .collapseExpandState()
            .split('-')
            .pop()
        ).toBe(`${value}`);
      });
    });
  });
});
