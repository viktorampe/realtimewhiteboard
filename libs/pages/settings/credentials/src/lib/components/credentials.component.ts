import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'campus-credentials-component',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  credentials$: Observable<string[]> = of([
    'test',
    'test2',
    'test3',
    'test4',
    'test5',
    'test6',
    'test7'
  ]);

  features$: Observable<Map<string, boolean>>;

  constructor() {
    const map = new Map();
    map.set('facebook', true);
    map.set('google', true);
    map.set('smartschool', true);
    this.features$ = of(map);
  }

  ngOnInit() {
    /*
    var error = getParameterByName('error');
        if(error){
            if(error === 'ForbiddenError: mixed_roles' || error === 'ForbiddenError: invalid_roles'){
                vm.message = 'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.';
            }
            if(error === 'Error: Credentials already linked'){
                vm.message = 'Dit account werd al aan een ander profiel gekoppeld.';
            }
            vm.messageStatus = 'alert-danger';
        }
    */
  }
}
