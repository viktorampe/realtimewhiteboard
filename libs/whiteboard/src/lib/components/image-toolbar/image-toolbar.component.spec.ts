import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { WhiteboardComponent } from '../whiteboard/whiteboard.component';
import { ImageToolbarComponent } from './image-toolbar.component';

describe('ImageToolbarComponent', () => {
  let component: ImageToolbarComponent;
  let fixture: ComponentFixture<ImageToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [
        {
          provide: WhiteboardComponent,
          useValue: { openFilePicker: jest.fn() }
        }
      ],
      declarations: [ImageToolbarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit removeClicked when emitRemoveClicked gets called', () => {
    spyOn(component.removeClicked, 'emit');
    component.emitRemoveClicked();
    expect(component.removeClicked.emit).toHaveBeenCalled();
  });
});
