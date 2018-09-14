/*
Component list-view
ontvangt array van objecten, zet in een lijst -> aparte componenten?
  -> ook inhoud toevoegen via content projection?
multiselect mogelijk - selectie in array bijhouden
moet content ook als grid kunnen weergeven
  -> Input + ngTemplate?
events opvangen? waarschijnlijk niet -> verantwoordelijkheid componenten

sources:
material design :https://material.angular.io/components/list/overview
github: https://github.com/angular/material2/blob/master/src/lib/list/list.ts
  -> MatListItem nog eens grondiger bekijken

TODO: navragen hoe material component toevoegen aan code. Import? Copy/paste?
 */

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  @Input() contentArray: object[];
  // @Input() viewTemplate: 'list' | 'grid';

  constructor() {}

  ngOnInit() {}
}
