import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { WhiteboardToolsComponent } from './whiteboard-tools.component';

describe('WhiteboardToolsComponent', () => {
  let component: WhiteboardToolsComponent;
  let fixture: ComponentFixture<WhiteboardToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [WhiteboardToolsComponent, ColorlistComponent]
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

  it('should emit when color is clicked', () => {
    spyOn(component.changeSelectedColor, 'emit');
    component.changeSelectedCardsColor('#000000');
    expect(component.changeSelectedColor.emit).toHaveBeenCalledWith('#000000');
  });
});
