import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodBookTileComponent } from './method-book-tile.component';

describe('MethodBookTileComponent', () => {
  let component: MethodBookTileComponent;
  let fixture: ComponentFixture<MethodBookTileComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [MethodBookTileComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodBookTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
