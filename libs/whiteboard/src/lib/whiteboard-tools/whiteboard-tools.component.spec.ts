import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WhiteboardToolsComponent } from './whiteboard-tools.component';

describe('WhiteboardToolsComponent', () => {
  let component: WhiteboardToolsComponent;
  let fixture: ComponentFixture<WhiteboardToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhiteboardToolsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when plus button is clicked', () => {
    spyOn(component.createCard, 'emit');
    expect(component.createCard.emit);
  });

  it('should emit when the delete button is clicked', () => {
    spyOn(component.deleteCards, 'emit');
    expect(component.deleteCards.emit);
  });

  it('should emit when the edit button is clicked', () => {
    spyOn(component.editCards, 'emit');
    expect(component.editCards.emit);
  });
});
