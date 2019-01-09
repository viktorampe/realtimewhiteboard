import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsCoupledTeachersComponent } from './settings-coupled-teachers.component';

describe('SettingsDashboardComponent', () => {
  let component: SettingsCoupledTeachersComponent;
  let fixture: ComponentFixture<SettingsCoupledTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsCoupledTeachersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsCoupledTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
