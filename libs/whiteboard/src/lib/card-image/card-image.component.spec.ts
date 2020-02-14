import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
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
});
