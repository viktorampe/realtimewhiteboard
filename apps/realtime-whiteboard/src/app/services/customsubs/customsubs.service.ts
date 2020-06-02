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
    whiteboardID: string
  ): Observable<OnCardChangedInWhiteboardSubscription> {
    const statement = `subscription OnCardChangedInWhiteboard($whiteboardID: ID!) {
      onCardChangedInWhiteboard(whiteboardID: $whiteboardID) {
        __typename
        id
        whiteboardID
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
      whiteboardID
    };

    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<OnCardChangedInWhiteboardSubscription>;
  }

  public OnCardCreatedInWhiteboardListener(
    whiteboardID: string
  ): Observable<OnCardChangedInWhiteboardSubscription> {
    const statement = `subscription OnCardAddedInWhiteboard($whiteboardID: ID!) {
      onCardAddedInWhiteboard(whiteboardID: $whiteboardID) {
        __typename
        id
        whiteboardID
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
      whiteboardID
    };

    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<OnCardChangedInWhiteboardSubscription>;
  }

  public OnCardDeleteInWhiteboardListener(
    whiteboardID: string
  ): Observable<OnCardChangedInWhiteboardSubscription> {
    const statement = `subscription OnCardRemovedInWhiteboard($whiteboardID: ID!) {
      onCardRemovedInWhiteboard(whiteboardID: $whiteboardID) {
        __typename
        id
        whiteboardID
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
      whiteboardID
    };

    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<OnCardChangedInWhiteboardSubscription>;
  }
}
