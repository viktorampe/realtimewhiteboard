import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltip,
  MatTooltipModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
        MatTooltipModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        NoopAnimationsModule
      ],
      declarations: [SettingsComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
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

  it('should emit isDirty = true on changes', fakeAsync(() => {
    jest.spyOn(component.isDirty, 'emit');

    component.settingsForm.patchValue({
      humanCosmological: true
    });
    tick(300);

    expect(component.isDirty.emit).toHaveBeenCalledTimes(1);
    expect(component.isDirty.emit).toHaveBeenCalledWith(true);
  }));

  it('should reset the forms initial data and emit isDirty = false on submit', fakeAsync(() => {
    component.settingsForm.patchValue({
      humanCosmological: true
    });
    tick(300);

    jest.spyOn(component.isDirty, 'emit');
    component.onSubmit();

    expect(component.isDirty.emit).toHaveBeenCalledTimes(1);
    expect(component.isDirty.emit).toHaveBeenCalledWith(false);
  }));

  it('should show the tooltips', () => {
    const tooltips: MatTooltip[] = fixture.debugElement
      .queryAll(By.directive(MatTooltip))
      .map(DE => DE.componentInstance);

    expect(tooltips.length).toBe(Object.keys(component.tooltips).length);
    Object.keys(component.tooltips).forEach(key => {
      expect(
        tooltips.some(tooltip => tooltip.message === component.tooltips[key])
      );
    });
  });
});
