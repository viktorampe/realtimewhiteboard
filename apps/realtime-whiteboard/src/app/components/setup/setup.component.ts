import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../../API.service';
import { SessionHelper } from '../../util/sessionhelper';

@Component({
  selector: 'campus-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  players: string[] = [
    'Viktor',
    'Frederic',
    'Thomas',
    'Tom',
    'Karl',
    'David',
    'Bert',
    'Yannis'
  ];

  constructor(private router: Router, private apiService: APIService) {}

  ngOnInit() {}

  setupSession() {
    // create session
    this.apiService
      .CreateSession({
        title: 'My first session',
        pincode: 123456,
        whiteboard: SessionHelper.getEmptyWhiteboardString()
      })
      .then(session => {
        // add players to session
        this.players.forEach(playerName => {
          this.apiService.CreatePlayer({
            sessionID: session.id,
            fullName: playerName
          });
        });
        // navigate to session
        this.router.navigate(['session', session.id]);
      })
      .catch(err => console.log(err));
  }
}
