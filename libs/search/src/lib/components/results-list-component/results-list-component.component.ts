import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

interface Sort {
  order: 'asc' | 'desc';
  name: string;
  priority: number;
}

@Directive({
  selector: '[campusResultHost], [result-host]'
})
export class ResultDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'campus-results-list-component',
  templateUrl: './results-list-component.component.html',
  styleUrls: ['./results-list-component.component.scss']
})
export class ResultsListComponentComponent<T> implements OnInit {
  public selected: any;

  @Input() results: any[];

  @Output() sort: EventEmitter<Sort[]> = new EventEmitter();
  @Output() scroll: EventEmitter<number> = new EventEmitter();

  @ViewChild(ResultDirective) resultHost: ResultDirective;

  constructor() {}

  ngOnInit() {
    this.loadComponent();
  }

  // https://angular.io/guide/dynamic-component-loader

  private loadComponent() {
    let viewContainerRef = this.resultHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<AdComponent>componentRef.instance).data = results;
  }
}
