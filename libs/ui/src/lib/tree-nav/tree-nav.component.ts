import { Component, OnInit, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';

/**
 * Json node data with nested structure. Each node has a title, an icon and optionally a list children
 */
export class NavItem {
  title: string;
  icon: string;
  link?: string;
  children?: NavItem[];
}

@Component({
  selector: 'campus-tree-nav',
  templateUrl: './tree-nav.component.html',
  styleUrls: ['./tree-nav.component.scss']
})
export class TreeNavComponent implements OnInit {
  @Input() treeNav: NavItem[];

  nestedDataSource: MatTreeNestedDataSource<NavItem>;
  nestedTreeControl: NestedTreeControl<NavItem>;

  ngOnInit() {
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedTreeControl = new NestedTreeControl<NavItem>(this._getChildren);

    this.nestedDataSource.data = this.treeNav;
  }

  /**
   * Function that should return true if the node template should be used for the provided index and node data
   * https://material.angular.io/cdk/tree/api#CdkTreeNodeDef
   */
  hasChildren = (_: number, nodeData: NavItem): boolean =>
    nodeData.children && nodeData.children.length > 0;

  /**
   * Get children of selected Node
   */
  private _getChildren = (node: NavItem): NavItem[] => node.children;
}
