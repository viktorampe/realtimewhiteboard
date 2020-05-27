import { Injectable } from '@angular/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Observable } from 'rxjs';
import { OnCreateCardSubscription } from '../../API.service';

@Injectable({
  providedIn: 'root'
})
export class CustomsubsciptionsService {
  constructor() {}

  OnCreateCardByWhiteboardListener(
    whiteboardId: string
  ): Observable<OnCreateCardSubscription> {
    const statement = `subscription SubscribeToCreateCardByWhiteboard($whiteboardId: ID!) {
        subscribeToCreateCardByWhiteboard(whiteboardId: $whiteboardId) {
          __typename
          id
          whiteboardID
          whiteboard {
            __typename
            id
            title
            defaultColor
            cards {
              __typename
              nextToken
              startedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          mode
          type
          color
          description
          image
          top
          left
          viewModeImage
          inShelf
          createdBy
          lastUpdatedBy
          _version
          _deleted
          _lastChangedAt
        }
      }`;

    const gqlAPIServiceArguments: any = {
      whiteboardId
    };
    return (API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as unknown) as Observable<OnCreateCardSubscription>;
  }
}
