import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        BrowserAnimationsModule
      ],
      declarations: [SettingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.settingsForm.setErrors(null); // make the form valid
    component.settingsForm.updateValueAndValidity(); // make sure the form knows it's valid
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when the form data is valid', () => {
    const saveSettingSpy = jest.spyOn(component.saveSettings, 'emit');
    component.onSubmit();
    expect(saveSettingSpy).toHaveBeenCalled();
    expect(saveSettingSpy).toHaveBeenCalledTimes(1);
  });
});
