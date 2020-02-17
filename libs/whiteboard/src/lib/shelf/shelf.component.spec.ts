import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardImageComponent } from '../card-image/card-image.component';
import { CardTextComponent } from '../card-text/card-text.component';
import { CardToolbarComponent } from '../card-toolbar/card-toolbar.component';
import { CardComponent } from '../card/card.component';
import { ColorListComponent } from '../color-list/color-list.component';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ShelfComponent } from './shelf.component';

describe('ShelfComponent', () => {
  let component: ShelfComponent;
  let fixture: ComponentFixture<ShelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        ShelfComponent,
        CardComponent,
        ColorListComponent,
        CardToolbarComponent,
        CardImageComponent,
        CardTextComponent,
        ProgressBarComponent,
        ImageToolbarComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
