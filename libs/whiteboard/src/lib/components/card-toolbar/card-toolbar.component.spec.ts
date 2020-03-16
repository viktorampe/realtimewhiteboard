import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { CardToolbarComponent } from './card-toolbar.component';

describe('CardToolbarComponent', () => {
  let component: CardToolbarComponent;
  let fixture: ComponentFixture<CardToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, BrowserAnimationsModule],
      declarations: [CardToolbarComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clickDeleteIcon when deleteIconClicked is called', () => {
    spyOn(component.clickDeleteIcon, 'emit');
    component.deleteIconClicked();
    expect(component.clickDeleteIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickEditIcon when editIconClicked is called', () => {
    spyOn(component.clickEditIcon, 'emit');

    const clickEvent = new MouseEvent('click');

    component.editIconClicked(clickEvent);
    expect(component.clickEditIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickFlipIcon when flipIconClicked is called', () => {
    spyOn(component.clickFlipIcon, 'emit');

    const clickEvent = new MouseEvent('click');

    component.flipIconClicked(clickEvent);
    expect(component.clickFlipIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickConfirmIcon when confirmIconClicked is called', () => {
    spyOn(component.clickConfirmIcon, 'emit');

    const clickEvent = new MouseEvent('click');

    component.confirmIconClicked(clickEvent);
    expect(component.clickConfirmIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickMultiSelectIcon when multiSelectClicked is called', () => {
    spyOn(component.clickMultiSelectIcon, 'emit');

    const clickEvent = new MouseEvent('click');

    component.multiSelectClicked(clickEvent);
    expect(component.clickMultiSelectIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickMultiSelectSelectedIcon when multiSelectSelectedClicked is called', () => {
    spyOn(component.clickMultiSelectSelectedIcon, 'emit');

    const clickEvent = new MouseEvent('click');

    component.multiSelectSelectedClicked(clickEvent);
    expect(component.clickMultiSelectSelectedIcon.emit).toHaveBeenCalled();
  });
});
