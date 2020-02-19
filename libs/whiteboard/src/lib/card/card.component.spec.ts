import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconRegistry,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { Mode } from '../../shared/enums/mode.enum';
import CardInterface from '../../shared/models/card.interface';
import { CardImageComponent } from '../card-image/card-image.component';
import { CardTextComponent } from '../card-text/card-text.component';
import { CardToolbarComponent } from '../card-toolbar/card-toolbar.component';
import { ColorListComponent } from '../color-list/color-list.component';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CardComponent,
        CardToolbarComponent,
        ColorListComponent,
        CardTextComponent,
        CardImageComponent,
        ImageToolbarComponent,
        ProgressBarComponent
      ],
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

    const mockData: CardInterface = {
      color: 'white',
      description: '',
      image: null,
      mode: Mode.IdleMode,
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

  it('should emit cardPressed when onPressCard gets called', () => {
    spyOn(component.cardPressed, 'emit');
    component.onPressCard();
    expect(component.cardPressed.emit).toHaveBeenCalled();
  });

  it('should emit cardTapped when onTapCard gets called', () => {
    spyOn(component.cardTapped, 'emit');
    component.onTapCard();
    expect(component.cardTapped.emit).toHaveBeenCalled();
  });

  it('should emit removeImage when emitRemoveImage gets called', () => {
    spyOn(component.removeImage, 'emit');
    component.emitRemoveImage();
    expect(component.removeImage.emit).toHaveBeenCalled();
  });

  it('should emit updateImage with the right image when emitUpdateImage gets called', () => {
    spyOn(component.updateImage, 'emit');
    component.emitUpdateImage('test');
    expect(component.updateImage.emit).toHaveBeenCalledWith('test');
  });

  it('should emit colorChange when selectColor gets called', () => {
    spyOn(component.colorChange, 'emit');
    component.selectColor('white');
    expect(component.colorChange.emit).toHaveBeenCalled();
  });

  it('should emit select when emitSelect is called', () => {
    spyOn(component.select, 'emit');
    component.emitSelect();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should emit deselect when emitDeselect is called', () => {
    spyOn(component.deselect, 'emit');
    component.emitDeselect();
    expect(component.deselect.emit).toHaveBeenCalled();
  });

  it('should emit deleteCard when emitDeleteCard is called', () => {
    spyOn(component.deleteCard, 'emit');
    component.emitDeleteCard();
    expect(component.deleteCard.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit edit when emitEditIcon is called', () => {
    spyOn(component.edit, 'emit');
    component.emitEditIcon();
    expect(component.edit.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit confirm when emitConfirmIcon is called', () => {
    spyOn(component.confirm, 'emit');
    component.emitConfirmIcon();
    expect(component.confirm.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit flip when emitFlipIcon is called', () => {
    spyOn(component.flip, 'emit');
    component.emitFlipIcon();
    expect(component.flip.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit flip when emitFlipIcon is called', () => {
    spyOn(component.descriptionChange, 'emit');
    component.onDescriptionChange('test');
    expect(component.descriptionChange.emit).toHaveBeenCalledWith('test');
  });

  it('should emit the right color when a cardcolor is picked', () => {
    spyOn(component.colorChange, 'emit');
    component.selectColor('black');
    expect(component.colorChange.emit).toHaveBeenCalledWith('black');
  });

  it('should show toolbar when mode is set to SelectedMode', () => {
    component.mode = Mode.SelectedMode;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(
      By.css('card__header__toolbar')
    );
    expect(toolbar).not.toBeNull();
  });

  it('should show toolbar when mode is set to EditMode', () => {
    component.mode = Mode.EditMode;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(
      By.css('card__header__toolbar')
    );
    expect(toolbar).not.toBeNull();
  });

  it('should show colorlist when mode is set to SelectedMode', () => {
    component.mode = Mode.SelectedMode;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(By.css('.card__color-list'));
    expect(toolbar).not.toBeNull();
  });

  it('should show colorlist when mode is set to EditMode', () => {
    component.mode = Mode.EditMode;
    fixture.detectChanges();
    const toolbar = fixture.debugElement.queryAll(By.css('.card__color-list'));
    expect(toolbar).not.toBeNull();
  });
});
