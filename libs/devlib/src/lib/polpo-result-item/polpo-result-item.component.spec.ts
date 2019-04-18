import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolpoResultItemComponent } from './polpo-result-item.component';

describe('PolpoResultItemComponentComponent', () => {
  let component: PolpoResultItemComponent;
  let fixture: ComponentFixture<PolpoResultItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolpoResultItemComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolpoResultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
