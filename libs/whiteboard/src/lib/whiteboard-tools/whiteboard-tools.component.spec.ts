import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { WhiteboardToolsComponent } from './whiteboard-tools.component';

describe('WhiteboardToolsComponent', () => {
  let component: WhiteboardToolsComponent;
  let fixture: ComponentFixture<WhiteboardToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
