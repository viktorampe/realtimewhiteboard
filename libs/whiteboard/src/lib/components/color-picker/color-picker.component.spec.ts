import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatIconModule],
      declarations: [ColorPickerComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the right swatch when a color element is clicked', () => {
    const color = '#000000';

    spyOn(component.selectedColor, 'emit');
    component.clickColor(color);
    expect(component.activeColor).toBe(color);
    expect(component.selectedColor.emit).toHaveBeenCalledWith(color);
  });

  it('should toggle active when color clicked', () => {
    const color = '#FF0000';
    component.clickColor(color);
    expect(component.active).toBeTruthy();
  });
});
