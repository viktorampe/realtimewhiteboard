import {
  Component,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

export class SearchResultItem {
  constructor(public component: Type<any>, public data: any) {}
}

export interface SearchResultItemInterface {
  data: any;
}

interface SortInterface {
  order: 'asc' | 'desc';
  name: string;
  priority: number;
}

@Directive({
  selector: '[campusResultListHost], [result-list-host]'
})
export class ResultListDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
    console.log('ResultListDirective');
  }
}

@Component({
  selector: 'campus-results-list-component',
  templateUrl: './results-list-component.component.html',
  styleUrls: ['./results-list-component.component.scss']
})
export class ResultsListComponentComponent<T> implements OnInit {
  public selected: any;
  private _host: ResultListDirective;
  private results: any[] = [];

  @Input()
  set resultsPage(results: any[]) {
    this.results.concat(results);
  }
  @Input() resultItem: SearchResultItem;

  @Output() sort: EventEmitter<SortInterface[]> = new EventEmitter();
  @Output() scroll: EventEmitter<number> = new EventEmitter();

  @ViewChild(ResultListDirective) resultListHost: ResultListDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadComponent();
  }

  // https://angular.io/guide/dynamic-component-loader

  private loadComponent() {
    console.log(this.resultListHost);

    this.resultListHost.viewContainerRef.clear();
    this.results.forEach(result => this.addResultItemComponent(result));
  }

  private addResultItemComponent(result) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.resultItem.component
    );
    const componentRef = this.resultListHost.viewContainerRef.createComponent(
      componentFactory
    );
    (componentRef.instance as SearchResultItemInterface).data = result;
  }
}
