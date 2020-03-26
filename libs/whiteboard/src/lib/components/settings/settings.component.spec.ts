import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsInterface } from '../../models/settings.interface';
import { ColorListComponent } from '../color-list/color-list.component';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule],
      declarations: [SettingsComponent, ColorListComponent]
    }).compileComponents();
  }));

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
