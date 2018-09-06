import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelActionComponent } from './action.component';

describe('InfoPanelActionComponent', () => {
  let component: InfoPanelActionComponent;
  let fixture: ComponentFixture<InfoPanelActionComponent>;
  let mockData: {
    actionText: string;
    icon: string;
    iconBackgroundColor: 'red' | 'gray';
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelActionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelActionComponent);
    component = fixture.componentInstance;

    mockData = {
      actionText: 'desired text',
      icon: 'given-icon',
      iconBackgroundColor: 'red'
    };

    component.actionText = mockData.actionText;
    component.icon = mockData.icon;
    component.iconBackgroundColor = mockData.iconBackgroundColor;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the actionsText', () => {
    const displayedText = fixture.debugElement.query(By.css('.text'))
      .nativeElement.textContent;
    expect(displayedText).toContain(mockData.actionText);
  });
  it('should show a red classed icon element', () => {
    const icon = fixture.debugElement.query(By.css('.red'));
    expect(icon).toBeTruthy();
  });
  it('should not show a gray classed icon element', () => {
    const icon = fixture.debugElement.query(By.css('.gray'));
    expect(icon).toBeFalsy();
  });
  it('should show the icon in the class for the icon element', () => {
    const icon = fixture.debugElement.query(By.css('.icon.given-icon'));
    expect(icon).toBeTruthy();
  });
  it('should emit the actionText when the icon is clicked', () => {
    let emitedText: string;
    component.iconClicked.subscribe((text: string) => (emitedText = text));

    fixture.debugElement
      .query(By.css('.icon'))
      .triggerEventHandler('click', null);
    expect(emitedText).toBe(mockData.actionText);
  });
});
