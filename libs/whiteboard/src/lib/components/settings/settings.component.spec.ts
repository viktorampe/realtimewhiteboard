import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { SettingsInterface } from '../../models/settings.interface';
import { ColorListComponent } from '../color-list/color-list.component';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  const mockColorPalettes = {
    dark: [
      { label: 'black', hexCode: '#000000' },
      { label: 'white', hexCode: '#FFFFFF' }
    ]
  };

  const mockThemeColor = 'this is a theme color';
  const mockTitle = 'this is a title';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent, ColorListComponent],
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    component.themeColor = mockThemeColor;
    component.title = mockTitle;
    component.colorPalettes = mockColorPalettes;

    component.ngOnInit();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('color-palette', () => {
    let colorPaletteFormControl: FormControl;

    beforeEach(() => {
      colorPaletteFormControl = component.settingsForm.get(
        'colorPalette'
      ) as FormControl;
    });

    it('should show a color-list when a color-palette is picked', async(() => {
      const colorList = fixture.debugElement.query(
        By.directive(ColorListComponent)
      );
      expect(colorList).toBeFalsy();

      colorPaletteFormControl.setValue('dark');
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const cList = fixture.debugElement.query(
          By.directive(ColorListComponent)
        );
        expect(cList).toBeTruthy();

        expect(cList.componentInstance.colorOptions).toEqual(
          mockColorPalettes.dark
        );
      });
    }));
  });

  it('setThemeColor() should set theme color', () => {
    component.setThemeColor('#00000000');

    expect(component.themeColor).toBe('#00000000');
  });

  describe('event handlers', () => {
    it('onSubmit() should emit settings', () => {
      spyOn(component.update, 'emit');

      component.settingsForm.get('title').setValue('foo title');
      component.themeColor = '#FFFFFFFF';

      component.onSubmit();

      const settings: SettingsInterface = {
        title: 'foo title',
        defaultColor: '#FFFFFFFF'
      };
      expect(component.update.emit).toHaveBeenCalledWith(settings);
    });
  });
});
