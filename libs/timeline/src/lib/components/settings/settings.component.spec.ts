import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { configureTestSuite } from 'ng-bullet';
import { TimelineSettingsInterface } from '../../interfaces/timeline';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        NoopAnimationsModule
      ],
      declarations: [SettingsComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when the form data is submitted', () => {
    const saveSettingSpy = jest.spyOn(component.saveSettings, 'emit');
    component.onSubmit();
    expect(saveSettingSpy).toHaveBeenCalled();
  });

  it('should use the correct default settings', () => {
    expect(component.settingsForm.get('humanCosmological').value).toEqual(
      false
    );
    expect(component.settingsForm.get('relative').value).toEqual(false);
    expect(component.settingsForm.get('scale_factor').value).toEqual(1);
  });

  it('should have the same values as the input', () => {
    const mockSettings: TimelineSettingsInterface = {
      scale: 'cosmological',
      options: { relative: true, scale_factor: 3 }
    };
    component.settings = mockSettings;
    component.ngOnInit();

    expect(component.settingsForm.get('humanCosmological').value).toEqual(true);
    expect(component.settingsForm.get('relative').value).toEqual(true);
    expect(component.settingsForm.get('scale_factor').value).toEqual(3);
  });
  //TODO: isDirty test
});
