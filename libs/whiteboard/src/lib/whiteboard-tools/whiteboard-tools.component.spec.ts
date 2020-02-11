import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { WhiteboardToolsComponent } from './whiteboard-tools.component';

describe('WhiteboardToolsComponent', () => {
  let component: WhiteboardToolsComponent;
  let fixture: ComponentFixture<WhiteboardToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [WhiteboardToolsComponent, ColorlistComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
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

  it('should emit when plus button is clicked', () => {
    spyOn(component.createCard, 'emit');
    const buttons = fixture.debugElement.queryAll(
      By.css('.whiteboard-tools__btn')
    );
    const plusBtn = buttons[0].nativeElement;
    plusBtn.click();
    expect(component.createCard.emit).toHaveBeenCalled();
  });
});
