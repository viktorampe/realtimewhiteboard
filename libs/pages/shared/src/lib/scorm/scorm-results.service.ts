import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';

@Injectable({
  providedIn: 'root'
})
export class ScormResultsService {

  constructor(personApi:PersonApi) {
    
  }
}
