import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@campus/dal';
import { WhiteboardModule } from '@campus/whiteboard';
import { of } from 'rxjs';
import { WhiteboardConfigService } from '../config.service';
import { PlayGroundComponent } from './play-ground.component';

describe('PlayGroundComponent', () => {
  let component: PlayGroundComponent;
  let fixture: ComponentFixture<PlayGroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule],
      declarations: [PlayGroundComponent],
      providers: [
        { provide: AuthService, useValue: { login: () => of({ userId: 1 }) } },
        {
          provide: WhiteboardConfigService,
          useValue: { previewInWrapper: () => {} }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayGroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
