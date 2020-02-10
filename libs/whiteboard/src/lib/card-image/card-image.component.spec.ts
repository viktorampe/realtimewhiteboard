import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardImageComponent } from './card-image.component';

describe('CardImageComponent', () => {
  let component: CardImageComponent;
  let fixture: ComponentFixture<CardImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardImageComponent]
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

  it('should emit imageClicked event when image is clicked', () => {
    spyOn(component.imageClicked, 'emit');
    component.onImageClicked();
    expect(component.imageClicked.emit).toHaveBeenCalledTimes(1);
  });
});
