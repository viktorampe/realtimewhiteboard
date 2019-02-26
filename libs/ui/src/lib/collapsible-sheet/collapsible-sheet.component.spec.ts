import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapsibleSheetComponent } from './collapsible-sheet.component';

describe('CollapsibleSheetComponent', () => {
  let component: CollapsibleSheetComponent;
  let fixture: ComponentFixture<CollapsibleSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
});
