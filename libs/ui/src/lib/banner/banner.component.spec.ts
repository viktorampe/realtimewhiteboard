import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Action } from '@ngrx/store';
import { UiModule } from '../ui.module';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent<Action>;
  let fixture: ComponentFixture<BannerComponent<Action>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<BannerComponent<Action>>(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have buttons', () => {
    component.actions = [
      {
        title: 'klik hier',
        userAction: {
          type: 'test'
        }
      }
    ];
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('campus-button'));
    expect(button.nativeElement.textContent).toContain('klik hier');
  });

  it('should dispatch clicks', () => {
    let bannerAction = {
      title: 'klik hier',
      userAction: {
        type: 'test'
      }
    };
    component.actions = [bannerAction];
    fixture.detectChanges();
    let action;
    const button = fixture.debugElement.query(By.css('campus-button'));
    component.afterDismiss.subscribe(a => {
      console.log(a);
      action = a;
    });
    button.triggerEventHandler('click', null);
    expect(button.nativeElement.textContent).toContain('klik hier');
    expect(action).toBe(bannerAction.userAction);
  });
});
