import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { ColorListComponent } from '../color-list/color-list.component';
import { WhiteboardToolbarComponent } from './whiteboard-toolbar.component';

describe('WhiteboardToolbarComponent', () => {
  let component: WhiteboardToolbarComponent;
  let fixture: ComponentFixture<WhiteboardToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [WhiteboardToolbarComponent, ColorListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when color is clicked', () => {
    spyOn(component.changeSelectedColor, 'emit');
    component.changeSelectedCardsColor('#000000');
    expect(component.changeSelectedColor.emit).toHaveBeenCalledWith('#000000');
  });
});
