import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodFavoriteTileComponent } from './method-favorite-tile.component';

describe('MethodFavoriteTileComponent', () => {
  let component: MethodFavoriteTileComponent;
  let fixture: ComponentFixture<MethodFavoriteTileComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [MethodFavoriteTileComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodFavoriteTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
