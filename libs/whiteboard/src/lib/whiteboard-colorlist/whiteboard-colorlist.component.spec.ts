import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WhiteboardColorlistComponent } from './whiteboard-colorlist.component';

describe('WhiteboardColorlistComponent', () => {
  let component: WhiteboardColorlistComponent;
  let fixture: ComponentFixture<WhiteboardColorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhiteboardColorlistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardColorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the right swatch when a swatch is clicked', () => {
    spyOn(component.selectedColor, 'emit');
    component.clickColor('black');
    expect(component.selectedColor.emit).toHaveBeenCalledWith('black');
  });
});
