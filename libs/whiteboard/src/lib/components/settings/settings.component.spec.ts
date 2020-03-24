import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    const defaultColorBefore = component.defaultColor;
    component.setDefaultColor('#00000000');
    const defaultColorAfter = component.defaultColor;
    expect(defaultColorBefore).not.toBe(defaultColorAfter);
    expect(component.defaultColor).toBe(defaultColorAfter);
  });

  describe('event handlers', () => {
    it('emitSettings() should emit settings', () => {
      spyOn(component.settings, 'emit');
      component.whiteboardTitle = 'title';
      component.defaultColor = '#FFFFFFFF';
      component.emitSettings();
      expect(component.settings.emit).toHaveBeenCalledWith({
        whiteboardTitle: 'title',
        defaultColor: '#FFFFFFFF'
      });
    });
  });
});
