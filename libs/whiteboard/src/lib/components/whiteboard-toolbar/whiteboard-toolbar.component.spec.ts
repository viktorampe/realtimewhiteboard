import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { ColorListComponent } from '../color-list/color-list.component';
import { WhiteboardToolbarComponent } from './whiteboard-toolbar.component';

describe('WhiteboardToolbarComponent', () => {
  let component: WhiteboardToolbarComponent;
  let fixture: ComponentFixture<WhiteboardToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, BrowserAnimationsModule],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }],
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

  it('should emit when delete is clicked', () => {
    spyOn(component.deleteCards, 'emit');
    const touchEvent = new TouchEvent('tap');
    Object.assign(touchEvent, 'event', {
      srcEvent: { stopPropagation: () => {} }
    });
    component.btnDeleteClicked(touchEvent);
    expect(component.deleteCards.emit).toHaveBeenCalledTimes(1);
  });
});
