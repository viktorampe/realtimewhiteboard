import { Component, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';

/**
 * Json node data with nested structure. Each node has a title, an icon and optionally a list children
 */
export interface NavItem {
  title: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'campus-tree-nav',
  templateUrl: './tree-nav.component.html',
  styleUrls: ['./tree-nav.component.scss']
})
export class TreeNavComponent {
  private _treeNav: NavItem[];

  @Input() set treeNav(treeNav: NavItem[]) {
    this._treeNav = treeNav;
    this._updateTreeNav();
  };

  nestedDataSource: MatTreeNestedDataSource<NavItem>;
  nestedTreeControl: NestedTreeControl<NavItem>;

  constructor() {
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedTreeControl = new NestedTreeControl<NavItem>(this._getChildren);
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

  /**
   * Update tree when new state is received
   */
  private _updateTreeNav(): void {
    this.nestedDataSource.data = this._treeNav;
    this.nestedTreeControl.dataNodes = this._treeNav;

    this._setExpanded(this.nestedTreeControl.dataNodes);
  }

  /**
   * Open tree nodes where 'expanded' property is true
   * @param nodes 
   */
  private _setExpanded(nodes): void {
    if (!nodes || nodes.length === 0) {
      return;
    }
    nodes.forEach((node) => {
      if (node.expanded) {
        this.nestedTreeControl.expand(node);
      }
      this._setExpanded(node.children);
    });
  }
}
