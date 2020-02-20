import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Mode } from '../../enums/mode.enum';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
import { CardImageComponent } from './card-image.component';

describe('CardImageComponent', () => {
  let component: CardImageComponent;
  let fixture: ComponentFixture<CardImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [CardImageComponent, ImageToolbarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show image toolbar if mode is EditMode', () => {
    component.mode = Mode.EditMode;
    fixture.detectChanges();

    const toolbar = fixture.debugElement.queryAll(
      By.css('campus-image-toolbar')
    );
    expect(toolbar.length).not.toBe(0);
  });

  it('should not show image toolbar if mode is SelectedMode', () => {
    component.mode = Mode.SelectedMode;
    fixture.detectChanges();

    const toolbar = fixture.debugElement.queryAll(
      By.css('campus-image-toolbar')
    );
    expect(toolbar.length).toBe(0);
  });

  it('should emit removeClicked when emitRemoveClicked gets called', () => {
    spyOn(component.removeClicked, 'emit');
    component.emitRemoveClicked();
    expect(component.removeClicked.emit).toHaveBeenCalled();
  });

  it('should emit updateClicked when emitUpdateClicked gets called', () => {
    spyOn(component.updateClicked, 'emit');
    component.emitUpdateClicked();
    expect(component.updateClicked.emit).toHaveBeenCalled();
  });
});
