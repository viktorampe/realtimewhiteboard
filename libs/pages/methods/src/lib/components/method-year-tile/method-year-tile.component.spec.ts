import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodYearTileComponent } from './method-year-tile.component';

describe('MethodYearTileComponent', () => {
  let component: MethodYearTileComponent;
  let fixture: ComponentFixture<MethodYearTileComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [MethodYearTileComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodYearTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
