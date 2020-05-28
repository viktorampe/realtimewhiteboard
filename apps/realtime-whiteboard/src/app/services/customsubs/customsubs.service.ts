import { Injectable } from '@angular/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as Observable from 'zen-observable';
import { OnCardChangedInWhiteboardSubscription } from '../../API.service';

@Injectable({
  providedIn: 'root'
})
export class CustomsubsService {
  constructor() {}

  public OnCardChangedInWhiteboardListener(
    whiteboardId: string
  ): Observable<OnCardChangedInWhiteboardSubscription> {
    console.log(whiteboardId);
    const statement = `subscription OnCardChangedInWhiteboard($whiteboardId: ID!) {
      onCardChangedInWhiteboard(whiteboardId: $whiteboardId) {
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
          createdAt
          updatedAt
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
        createdAt
        updatedAt
      }
    }`;
    const gqlAPIServiceArguments: any = {
      whiteboardId
    };

    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<OnCardChangedInWhiteboardSubscription>;
  }
}
