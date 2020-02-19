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

  it("should replace card's image when replaceImage gets called", () => {
    component.emitUpdateImage('test-image');
    expect(component.image).toBe('test-image');
  });

  it('should set mode to IdleMode when pressCard gets called and starting from SelectedMode', () => {
    component.mode = <Mode>Mode.SelectedMode;
    component.onPressCard();
    expect(component.mode).toBe(Mode.IdleMode);
  });

  it('should set mode to IdleMode when pressCard gets called and starting from EditMode', () => {
    component.mode = <Mode>Mode.EditMode;
    component.onPressCard();
    expect(component.mode).toBe(Mode.IdleMode);
  });

  it('should set mode to IdleMode when a color is clicked from the colorlist from SelectedMode', () => {
    component.mode = <Mode>Mode.SelectedMode;
    component.selectColor('white');
    expect(component.mode).toBe(Mode.IdleMode);
  });

  it('should set mode to IdleMode when a color is clicked from the colorlist from EditMode', () => {
    component.mode = <Mode>Mode.EditMode;
    component.selectColor('white');
    expect(component.mode).toBe(Mode.IdleMode);
  });

  it('should change the cardcolor when a color is picked', () => {
    component.mode = Mode.SelectedMode;
    component.selectColor('black');
    expect(component.color).toBe('black');
  });

  it('should emit the right color when a cardcolor is picked', () => {
    spyOn(component.colorChange, 'emit');
    component.selectColor('black');
    expect(component.colorChange.emit).toHaveBeenCalledWith('black');
  });

  it('should emit deleteCard when emitDeleteCard is called', () => {
    spyOn(component.deleteCard, 'emit');
    component.emitDeleteCard();
    expect(component.deleteCard.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit select when setMultiSelectSelectedMode is called', () => {
    spyOn(component.select, 'emit');
    component.setMultiSelectSelectedMode();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should emit the select emitter when setMultiSelectSelectedMode is called ', () => {
    spyOn(component.select, 'emit');
    component.setMultiSelectSelectedMode();
    expect(component.select.emit).toHaveBeenCalled();
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
