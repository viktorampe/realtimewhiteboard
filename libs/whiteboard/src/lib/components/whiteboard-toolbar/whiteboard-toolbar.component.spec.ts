import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { ColorListComponent } from '../color-list/color-list.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { WhiteboardToolbarComponent } from './whiteboard-toolbar.component';

describe('WhiteboardToolbarComponent', () => {
  let component: WhiteboardToolbarComponent;
  let fixture: ComponentFixture<WhiteboardToolbarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, BrowserAnimationsModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ],
      declarations: [
        WhiteboardToolbarComponent,
        ColorListComponent,
        ColorPickerComponent
      ]
    });
  });

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

    component.btnDeleteClicked();
    expect(component.deleteCards.emit).toHaveBeenCalledTimes(1);
  });
});
