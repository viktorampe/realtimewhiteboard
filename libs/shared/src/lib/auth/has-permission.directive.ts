import {
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionService } from './permission.service';
import { PERMISSION_SERVICE_TOKEN } from './permission.service.interface';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permission$: Subscription;
  @Input() hasPermission: string | string[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.applyPermission();
  }

  ngOnDestroy(): void {
    this.permission$.unsubscribe();
  }

  private applyPermission(): void {
    this.permission$ = this.permissionService
      .hasPermission(this.hasPermission)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
