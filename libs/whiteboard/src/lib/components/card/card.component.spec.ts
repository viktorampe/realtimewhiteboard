import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { v4 as uuidv4 } from 'uuid';
import { ModeEnum } from '../../enums/mode.enum';
import CardInterface from '../../models/card.interface';
import { WhiteboardModule } from '../../whiteboard.module';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let updateSpy;
  let removeSpy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule],
      declarations: [],
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
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    updateSpy = spyOn(component.update, 'emit');
    removeSpy = spyOn(component.removeImage, 'emit');

    const mockData: CardInterface = {
      id: uuidv4(),
      color: 'white',
      description: '',
      image: {},
      mode: ModeEnum.IDLE,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.color = mockData.color;
    component.description = mockData.description;
    component.image = mockData.image;
    component.mode = mockData.mode;
    component.viewModeImage = mockData.viewModeImage;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removeImage should trigger remove', () => {
    component.removeImg();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('selectColor should trigger update', () => {
    const color = 'red';
    component.selectColor(color);
    expect(updateSpy).toHaveBeenCalledWith({ color: color });
  });

  it('updateDescription should trigger update', () => {
    const text = 'shiba inu';
    component.updateDescription(text);
    expect(updateSpy).toHaveBeenCalledWith({ description: text });
  });

  it('selectImage should trigger update', () => {
    const openFilePickerSpy = spyOn(component.openFilePicker, 'emit');
    component.selectImage();
    expect(openFilePickerSpy).toHaveBeenCalled();
  });

  it('should show toolbar when mode is set to SelectedMode', () => {
    component.mode = ModeEnum.SELECTED;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(
      By.css('card__header__toolbar')
    );
    expect(toolbar).not.toBeNull();
  });

  it('should show toolbar when mode is set to EditMode', () => {
    component.mode = ModeEnum.EDIT;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(
      By.css('card__header__toolbar')
    );
    expect(toolbar).not.toBeNull();
  });

  it('should show colorlist when mode is set to SelectedMode', () => {
    component.mode = ModeEnum.SELECTED;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(By.css('.card__color-list'));
    expect(toolbar).not.toBeNull();
  });

  it('should show colorlist when mode is set to EditMode', () => {
    component.mode = ModeEnum.EDIT;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(By.css('.card__color-list'));
    expect(toolbar).not.toBeNull();
  });
});
