import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'campus-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent<T> {
  @Input() message: string;
  @Input() icon: string;
  @Input() actions: BannerAction<T>[];
  @Output() afterDismiss = new EventEmitter<T>();

  private mobile: boolean;
  private subscriptions: Subscription = new Subscription();

  @HostBinding('class.ui-banner--mobile')
  get isMobile() {
    return this.mobile;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    this.subscriptions.add(
      this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small])
        .pipe(
          map(state => {
            console.log(state);
            return state;
          })
        )
        .subscribe((state: BreakpointState) => (this.mobile = state.matches))
    );
  }

  onAction(action: T) {
    this.afterDismiss.next(action);
  }
}

export interface BannerAction<T> {
  title: string;
  userAction: T;
}
