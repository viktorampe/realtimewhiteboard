import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { SettingsInterface } from '../../models/settings.interface';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent, ColorPickerComponent],
      imports: [FormsModule, NoopAnimationsModule, MatIconModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set defaut color', () => {
    const defaultColorBefore = component.activeColor;
    component.setDefaultColor('#00000000');
    const defaultColorAfter = component.activeColor;
    expect(defaultColorBefore).not.toBe(defaultColorAfter);
    expect(component.activeColor).toBe(defaultColorAfter);
  });

  describe('event handlers', () => {
    it('onSubmit() should emit settings', () => {
      spyOn(component.update, 'emit');
      component.title = 'title';
      component.activeColor = '#FFFFFFFF';
      component.onSubmit();
      const settings: SettingsInterface = {
        title: 'title',
        defaultColor: '#FFFFFFFF'
      };
      expect(component.update.emit).toHaveBeenCalledWith(settings);
    });
  });
});
