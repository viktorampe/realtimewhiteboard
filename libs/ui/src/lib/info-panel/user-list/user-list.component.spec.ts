import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelUserListComponent } from './user-list.component';

describe('InfoPanelUserListComponent', () => {
  let component: InfoPanelUserListComponent;
  let fixture: ComponentFixture<InfoPanelUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelUserListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
