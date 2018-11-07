import { Injectable } from '@angular/core';
import { ResultsService } from '../results/results.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService implements ExerciseServiceInterface {
  constructor(resultsService: ResultsService) {}
}
