import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { CardToolbarComponent } from './card-toolbar.component';

describe('CardToolbarComponent', () => {
  let component: CardToolbarComponent;
  let fixture: ComponentFixture<CardToolbarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, BrowserAnimationsModule],
      declarations: [CardToolbarComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

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

  it('should emit clickReturntoshelfIcon when returntoshelfIcon is called', () => {
    spyOn(component.clickReturnToShelfIcon, 'emit');
    component.returnToShelfIconClicked();
    expect(component.clickReturnToShelfIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickEditIcon when editIconClicked is called', () => {
    spyOn(component.clickEditIcon, 'emit');

    component.editIconClicked();
    expect(component.clickEditIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickFlipIcon when flipIconClicked is called', () => {
    spyOn(component.clickFlipIcon, 'emit');

    component.flipIconClicked();
    expect(component.clickFlipIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickConfirmIcon when confirmIconClicked is called', () => {
    spyOn(component.clickConfirmIcon, 'emit');

    component.confirmIconClicked();
    expect(component.clickConfirmIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickMultiSelectIcon when multiSelectClicked is called', () => {
    spyOn(component.clickMultiSelectIcon, 'emit');

    component.multiSelectClicked();
    expect(component.clickMultiSelectIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickMultiSelectSelectedIcon when multiSelectSelectedClicked is called', () => {
    spyOn(component.clickMultiSelectSelectedIcon, 'emit');

    component.multiSelectSelectedClicked();
    expect(component.clickMultiSelectSelectedIcon.emit).toHaveBeenCalled();
  });
});
