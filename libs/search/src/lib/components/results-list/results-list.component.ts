import {
  Component,
  ComponentFactory,
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
import { SearchResultItemInterface, SortInterface } from '../../interfaces';

// https://angular.io/guide/dynamic-component-loader

@Directive({
  selector: '[campusResultListHost], [result-list-host]'
})
export class ResultListDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'campus-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnInit {
  public selected: any;
  private componentFactory: ComponentFactory<SearchResultItemInterface>;

  @Input() resultItem: Type<SearchResultItemInterface>;
  @Input()
  set resultsPage(results: any[]) {
    if (!this.componentFactory) {
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.resultItem
      );
    }
    this.loadComponent(results);
  }

  @Output() sort: EventEmitter<SortInterface[]> = new EventEmitter();
  @Output() scroll: EventEmitter<number> = new EventEmitter();

  @ViewChild(ResultListDirective) resultListHost: ResultListDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {}

  private loadComponent(results = [], clearResults = false) {
    if (clearResults) {
      this.resultListHost.viewContainerRef.clear();
    }
    results.forEach(result => this.addResultItemComponent(result));
  }

  private addResultItemComponent(result) {
    const componentRef = this.resultListHost.viewContainerRef.createComponent(
      this.componentFactory
    );
    (componentRef.instance as SearchResultItemInterface).data = result;
  }
}
