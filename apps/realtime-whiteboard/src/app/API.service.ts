/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import * as Observable from "zen-observable";

export type CreateSessionInput = {
  id?: string | null;
  title: string;
  pincode: number;
  whiteboardID: string;
  _version?: number | null;
};

export type ModelSessionConditionInput = {
  title?: ModelStringInput | null;
  pincode?: ModelIntInput | null;
  whiteboardID?: ModelIDInput | null;
  and?: Array<ModelSessionConditionInput | null> | null;
  or?: Array<ModelSessionConditionInput | null> | null;
  not?: ModelSessionConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type UpdateSessionInput = {
  id: string;
  title?: string | null;
  pincode?: number | null;
  whiteboardID?: string | null;
  _version?: number | null;
};

export type DeleteSessionInput = {
  id?: string | null;
  _version?: number | null;
};

export type CreateWhiteboardInput = {
  id?: string | null;
  title?: string | null;
  defaultColor?: string | null;
  _version?: number | null;
};

export type ModelWhiteboardConditionInput = {
  title?: ModelStringInput | null;
  defaultColor?: ModelStringInput | null;
  and?: Array<ModelWhiteboardConditionInput | null> | null;
  or?: Array<ModelWhiteboardConditionInput | null> | null;
  not?: ModelWhiteboardConditionInput | null;
};

export type UpdateWhiteboardInput = {
  id: string;
  title?: string | null;
  defaultColor?: string | null;
  _version?: number | null;
};

export type DeleteWhiteboardInput = {
  id?: string | null;
  _version?: number | null;
};

export type CreatePlayerInput = {
  id?: string | null;
  sessionID: string;
  session?: SessionInput | null;
  fullName: string;
  isTeacher: boolean;
  _version?: number | null;
};

export type SessionInput = {
  id: string;
  title: string;
  pincode: number;
  whiteboardID: string;
  whiteboard?: WhiteboardInput | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type WhiteboardInput = {
  id: string;
  title?: string | null;
  defaultColor?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelPlayerConditionInput = {
  sessionID?: ModelIDInput | null;
  fullName?: ModelStringInput | null;
  isTeacher?: ModelBooleanInput | null;
  and?: Array<ModelPlayerConditionInput | null> | null;
  or?: Array<ModelPlayerConditionInput | null> | null;
  not?: ModelPlayerConditionInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type UpdatePlayerInput = {
  id: string;
  sessionID?: string | null;
  session?: SessionInput | null;
  fullName?: string | null;
  isTeacher?: boolean | null;
  _version?: number | null;
};

export type DeletePlayerInput = {
  id?: string | null;
  _version?: number | null;
};

export type CreateCardInput = {
  id?: string | null;
  whiteboardID: string;
  whiteboard?: WhiteboardInput | null;
  mode: number;
  type: number;
  color: string;
  description?: string | null;
  image?: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version?: number | null;
};

export type ModelCardConditionInput = {
  whiteboardID?: ModelIDInput | null;
  mode?: ModelIntInput | null;
  type?: ModelIntInput | null;
  color?: ModelStringInput | null;
  description?: ModelStringInput | null;
  image?: ModelStringInput | null;
  top?: ModelIntInput | null;
  left?: ModelIntInput | null;
  viewModeImage?: ModelBooleanInput | null;
  inShelf?: ModelBooleanInput | null;
  and?: Array<ModelCardConditionInput | null> | null;
  or?: Array<ModelCardConditionInput | null> | null;
  not?: ModelCardConditionInput | null;
};

export type UpdateCardInput = {
  id: string;
  whiteboardID?: string | null;
  whiteboard?: WhiteboardInput | null;
  mode?: number | null;
  type?: number | null;
  color?: string | null;
  description?: string | null;
  image?: string | null;
  top?: number | null;
  left?: number | null;
  viewModeImage?: boolean | null;
  inShelf?: boolean | null;
  _version?: number | null;
};

export type DeleteCardInput = {
  id?: string | null;
  _version?: number | null;
};

export type ModelSessionFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  pincode?: ModelIntInput | null;
  whiteboardID?: ModelIDInput | null;
  and?: Array<ModelSessionFilterInput | null> | null;
  or?: Array<ModelSessionFilterInput | null> | null;
  not?: ModelSessionFilterInput | null;
};

export type ModelWhiteboardFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  defaultColor?: ModelStringInput | null;
  and?: Array<ModelWhiteboardFilterInput | null> | null;
  or?: Array<ModelWhiteboardFilterInput | null> | null;
  not?: ModelWhiteboardFilterInput | null;
};

export type ModelPlayerFilterInput = {
  id?: ModelIDInput | null;
  sessionID?: ModelIDInput | null;
  fullName?: ModelStringInput | null;
  isTeacher?: ModelBooleanInput | null;
  and?: Array<ModelPlayerFilterInput | null> | null;
  or?: Array<ModelPlayerFilterInput | null> | null;
  not?: ModelPlayerFilterInput | null;
};

export type ModelCardFilterInput = {
  id?: ModelStringInput | null;
  whiteboardID?: ModelIDInput | null;
  mode?: ModelIntInput | null;
  type?: ModelIntInput | null;
  color?: ModelStringInput | null;
  description?: ModelStringInput | null;
  image?: ModelStringInput | null;
  top?: ModelIntInput | null;
  left?: ModelIntInput | null;
  viewModeImage?: ModelBooleanInput | null;
  inShelf?: ModelBooleanInput | null;
  and?: Array<ModelCardFilterInput | null> | null;
  or?: Array<ModelCardFilterInput | null> | null;
  not?: ModelCardFilterInput | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type CreateSessionMutation = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type UpdateSessionMutation = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type DeleteSessionMutation = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type CreateWhiteboardMutation = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type UpdateWhiteboardMutation = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type DeleteWhiteboardMutation = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type CreatePlayerMutation = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type UpdatePlayerMutation = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type DeletePlayerMutation = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type CreateCardMutation = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type UpdateCardMutation = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type DeleteCardMutation = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type SyncSessionsQuery = {
  __typename: "ModelSessionConnection";
  items: Array<{
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type GetSessionQuery = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type ListSessionsQuery = {
  __typename: "ModelSessionConnection";
  items: Array<{
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type SyncWhiteboardsQuery = {
  __typename: "ModelWhiteboardConnection";
  items: Array<{
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type GetWhiteboardQuery = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type ListWhiteboardsQuery = {
  __typename: "ModelWhiteboardConnection";
  items: Array<{
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type SyncPlayersQuery = {
  __typename: "ModelPlayerConnection";
  items: Array<{
    __typename: "Player";
    id: string;
    sessionID: string;
    session: {
      __typename: "Session";
      id: string;
      title: string;
      pincode: number;
      whiteboardID: string;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    fullName: string;
    isTeacher: boolean;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type GetPlayerQuery = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type ListPlayersQuery = {
  __typename: "ModelPlayerConnection";
  items: Array<{
    __typename: "Player";
    id: string;
    sessionID: string;
    session: {
      __typename: "Session";
      id: string;
      title: string;
      pincode: number;
      whiteboardID: string;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    fullName: string;
    isTeacher: boolean;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type SyncCardsQuery = {
  __typename: "ModelCardConnection";
  items: Array<{
    __typename: "Card";
    id: string;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    mode: number;
    type: number;
    color: string;
    description: string | null;
    image: string | null;
    top: number;
    left: number;
    viewModeImage: boolean;
    inShelf: boolean;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type GetCardQuery = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type ListCardsQuery = {
  __typename: "ModelCardConnection";
  items: Array<{
    __typename: "Card";
    id: string;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    mode: number;
    type: number;
    color: string;
    description: string | null;
    image: string | null;
    top: number;
    left: number;
    viewModeImage: boolean;
    inShelf: boolean;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type PlayerBySessionIdQuery = {
  __typename: "ModelPlayerConnection";
  items: Array<{
    __typename: "Player";
    id: string;
    sessionID: string;
    session: {
      __typename: "Session";
      id: string;
      title: string;
      pincode: number;
      whiteboardID: string;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    fullName: string;
    isTeacher: boolean;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type CardByWhiteboardIdQuery = {
  __typename: "ModelCardConnection";
  items: Array<{
    __typename: "Card";
    id: string;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    mode: number;
    type: number;
    color: string;
    description: string | null;
    image: string | null;
    top: number;
    left: number;
    viewModeImage: boolean;
    inShelf: boolean;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null> | null;
  nextToken: string | null;
  startedAt: number | null;
};

export type OnCreateSessionSubscription = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateSessionSubscription = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteSessionSubscription = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
      isTeacher: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateWhiteboardSubscription = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateWhiteboardSubscription = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteWhiteboardSubscription = {
  __typename: "Whiteboard";
  id: string;
  title: string | null;
  defaultColor: string | null;
  cards: {
    __typename: "ModelCardConnection";
    items: Array<{
      __typename: "Card";
      id: string;
      whiteboardID: string;
      mode: number;
      type: number;
      color: string;
      description: string | null;
      image: string | null;
      top: number;
      left: number;
      viewModeImage: boolean;
      inShelf: boolean;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null> | null;
    nextToken: string | null;
    startedAt: number | null;
  } | null;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnCreatePlayerSubscription = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdatePlayerSubscription = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnDeletePlayerSubscription = {
  __typename: "Player";
  id: string;
  sessionID: string;
  session: {
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    whiteboardID: string;
    whiteboard: {
      __typename: "Whiteboard";
      id: string;
      title: string | null;
      defaultColor: string | null;
      _version: number;
      _deleted: boolean | null;
      _lastChangedAt: number;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  fullName: string;
  isTeacher: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateCardSubscription = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateCardSubscription = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteCardSubscription = {
  __typename: "Card";
  id: string;
  whiteboardID: string;
  whiteboard: {
    __typename: "Whiteboard";
    id: string;
    title: string | null;
    defaultColor: string | null;
    cards: {
      __typename: "ModelCardConnection";
      nextToken: string | null;
      startedAt: number | null;
    } | null;
    _version: number;
    _deleted: boolean | null;
    _lastChangedAt: number;
  } | null;
  mode: number;
  type: number;
  color: string;
  description: string | null;
  image: string | null;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  _version: number;
  _deleted: boolean | null;
  _lastChangedAt: number;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateSession(
    input: CreateSessionInput,
    condition?: ModelSessionConditionInput
  ): Promise<CreateSessionMutation> {
    const statement = `mutation CreateSession($input: CreateSessionInput!, $condition: ModelSessionConditionInput) {
        createSession(input: $input, condition: $condition) {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateSessionMutation>response.data.createSession;
  }
  async UpdateSession(
    input: UpdateSessionInput,
    condition?: ModelSessionConditionInput
  ): Promise<UpdateSessionMutation> {
    const statement = `mutation UpdateSession($input: UpdateSessionInput!, $condition: ModelSessionConditionInput) {
        updateSession(input: $input, condition: $condition) {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSessionMutation>response.data.updateSession;
  }
  async DeleteSession(
    input: DeleteSessionInput,
    condition?: ModelSessionConditionInput
  ): Promise<DeleteSessionMutation> {
    const statement = `mutation DeleteSession($input: DeleteSessionInput!, $condition: ModelSessionConditionInput) {
        deleteSession(input: $input, condition: $condition) {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteSessionMutation>response.data.deleteSession;
  }
  async CreateWhiteboard(
    input: CreateWhiteboardInput,
    condition?: ModelWhiteboardConditionInput
  ): Promise<CreateWhiteboardMutation> {
    const statement = `mutation CreateWhiteboard($input: CreateWhiteboardInput!, $condition: ModelWhiteboardConditionInput) {
        createWhiteboard(input: $input, condition: $condition) {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateWhiteboardMutation>response.data.createWhiteboard;
  }
  async UpdateWhiteboard(
    input: UpdateWhiteboardInput,
    condition?: ModelWhiteboardConditionInput
  ): Promise<UpdateWhiteboardMutation> {
    const statement = `mutation UpdateWhiteboard($input: UpdateWhiteboardInput!, $condition: ModelWhiteboardConditionInput) {
        updateWhiteboard(input: $input, condition: $condition) {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateWhiteboardMutation>response.data.updateWhiteboard;
  }
  async DeleteWhiteboard(
    input: DeleteWhiteboardInput,
    condition?: ModelWhiteboardConditionInput
  ): Promise<DeleteWhiteboardMutation> {
    const statement = `mutation DeleteWhiteboard($input: DeleteWhiteboardInput!, $condition: ModelWhiteboardConditionInput) {
        deleteWhiteboard(input: $input, condition: $condition) {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteWhiteboardMutation>response.data.deleteWhiteboard;
  }
  async CreatePlayer(
    input: CreatePlayerInput,
    condition?: ModelPlayerConditionInput
  ): Promise<CreatePlayerMutation> {
    const statement = `mutation CreatePlayer($input: CreatePlayerInput!, $condition: ModelPlayerConditionInput) {
        createPlayer(input: $input, condition: $condition) {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreatePlayerMutation>response.data.createPlayer;
  }
  async UpdatePlayer(
    input: UpdatePlayerInput,
    condition?: ModelPlayerConditionInput
  ): Promise<UpdatePlayerMutation> {
    const statement = `mutation UpdatePlayer($input: UpdatePlayerInput!, $condition: ModelPlayerConditionInput) {
        updatePlayer(input: $input, condition: $condition) {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdatePlayerMutation>response.data.updatePlayer;
  }
  async DeletePlayer(
    input: DeletePlayerInput,
    condition?: ModelPlayerConditionInput
  ): Promise<DeletePlayerMutation> {
    const statement = `mutation DeletePlayer($input: DeletePlayerInput!, $condition: ModelPlayerConditionInput) {
        deletePlayer(input: $input, condition: $condition) {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeletePlayerMutation>response.data.deletePlayer;
  }
  async CreateCard(
    input: CreateCardInput,
    condition?: ModelCardConditionInput
  ): Promise<CreateCardMutation> {
    const statement = `mutation CreateCard($input: CreateCardInput!, $condition: ModelCardConditionInput) {
        createCard(input: $input, condition: $condition) {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateCardMutation>response.data.createCard;
  }
  async UpdateCard(
    input: UpdateCardInput,
    condition?: ModelCardConditionInput
  ): Promise<UpdateCardMutation> {
    const statement = `mutation UpdateCard($input: UpdateCardInput!, $condition: ModelCardConditionInput) {
        updateCard(input: $input, condition: $condition) {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateCardMutation>response.data.updateCard;
  }
  async DeleteCard(
    input: DeleteCardInput,
    condition?: ModelCardConditionInput
  ): Promise<DeleteCardMutation> {
    const statement = `mutation DeleteCard($input: DeleteCardInput!, $condition: ModelCardConditionInput) {
        deleteCard(input: $input, condition: $condition) {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteCardMutation>response.data.deleteCard;
  }
  async SyncSessions(
    filter?: ModelSessionFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncSessionsQuery> {
    const statement = `query SyncSessions($filter: ModelSessionFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncSessions(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncSessionsQuery>response.data.syncSessions;
  }
  async GetSession(id: string): Promise<GetSessionQuery> {
    const statement = `query GetSession($id: ID!) {
        getSession(id: $id) {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSessionQuery>response.data.getSession;
  }
  async ListSessions(
    filter?: ModelSessionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListSessionsQuery> {
    const statement = `query ListSessions($filter: ModelSessionFilterInput, $limit: Int, $nextToken: String) {
        listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSessionsQuery>response.data.listSessions;
  }
  async SyncWhiteboards(
    filter?: ModelWhiteboardFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncWhiteboardsQuery> {
    const statement = `query SyncWhiteboards($filter: ModelWhiteboardFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncWhiteboards(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
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
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncWhiteboardsQuery>response.data.syncWhiteboards;
  }
  async GetWhiteboard(id: string): Promise<GetWhiteboardQuery> {
    const statement = `query GetWhiteboard($id: ID!) {
        getWhiteboard(id: $id) {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetWhiteboardQuery>response.data.getWhiteboard;
  }
  async ListWhiteboards(
    filter?: ModelWhiteboardFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListWhiteboardsQuery> {
    const statement = `query ListWhiteboards($filter: ModelWhiteboardFilterInput, $limit: Int, $nextToken: String) {
        listWhiteboards(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
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
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListWhiteboardsQuery>response.data.listWhiteboards;
  }
  async SyncPlayers(
    filter?: ModelPlayerFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncPlayersQuery> {
    const statement = `query SyncPlayers($filter: ModelPlayerFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncPlayers(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            sessionID
            session {
              __typename
              id
              title
              pincode
              whiteboardID
              _version
              _deleted
              _lastChangedAt
            }
            fullName
            isTeacher
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncPlayersQuery>response.data.syncPlayers;
  }
  async GetPlayer(id: string): Promise<GetPlayerQuery> {
    const statement = `query GetPlayer($id: ID!) {
        getPlayer(id: $id) {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetPlayerQuery>response.data.getPlayer;
  }
  async ListPlayers(
    filter?: ModelPlayerFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListPlayersQuery> {
    const statement = `query ListPlayers($filter: ModelPlayerFilterInput, $limit: Int, $nextToken: String) {
        listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            sessionID
            session {
              __typename
              id
              title
              pincode
              whiteboardID
              _version
              _deleted
              _lastChangedAt
            }
            fullName
            isTeacher
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListPlayersQuery>response.data.listPlayers;
  }
  async SyncCards(
    filter?: ModelCardFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncCardsQuery> {
    const statement = `query SyncCards($filter: ModelCardFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncCards(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
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
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncCardsQuery>response.data.syncCards;
  }
  async GetCard(id: string): Promise<GetCardQuery> {
    const statement = `query GetCard($id: ID!) {
        getCard(id: $id) {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetCardQuery>response.data.getCard;
  }
  async ListCards(
    filter?: ModelCardFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListCardsQuery> {
    const statement = `query ListCards($filter: ModelCardFilterInput, $limit: Int, $nextToken: String) {
        listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
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
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListCardsQuery>response.data.listCards;
  }
  async PlayerBySessionId(
    sessionID?: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelPlayerFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<PlayerBySessionIdQuery> {
    const statement = `query PlayerBySessionId($sessionID: ID, $sortDirection: ModelSortDirection, $filter: ModelPlayerFilterInput, $limit: Int, $nextToken: String) {
        playerBySessionID(sessionID: $sessionID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            sessionID
            session {
              __typename
              id
              title
              pincode
              whiteboardID
              _version
              _deleted
              _lastChangedAt
            }
            fullName
            isTeacher
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (sessionID) {
      gqlAPIServiceArguments.sessionID = sessionID;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <PlayerBySessionIdQuery>response.data.playerBySessionID;
  }
  async CardByWhiteboardId(
    whiteboardID?: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelCardFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<CardByWhiteboardIdQuery> {
    const statement = `query CardByWhiteboardId($whiteboardID: ID, $sortDirection: ModelSortDirection, $filter: ModelCardFilterInput, $limit: Int, $nextToken: String) {
        cardByWhiteboardID(whiteboardID: $whiteboardID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
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
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (whiteboardID) {
      gqlAPIServiceArguments.whiteboardID = whiteboardID;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CardByWhiteboardIdQuery>response.data.cardByWhiteboardID;
  }
  OnCreateSessionListener: Observable<
    OnCreateSessionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateSession {
        onCreateSession {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnCreateSessionSubscription>;

  OnUpdateSessionListener: Observable<
    OnUpdateSessionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateSession {
        onUpdateSession {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnUpdateSessionSubscription>;

  OnDeleteSessionListener: Observable<
    OnDeleteSessionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteSession {
        onDeleteSession {
          __typename
          id
          title
          pincode
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
              isTeacher
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
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
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnDeleteSessionSubscription>;

  OnCreateWhiteboardListener: Observable<
    OnCreateWhiteboardSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateWhiteboard {
        onCreateWhiteboard {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnCreateWhiteboardSubscription>;

  OnUpdateWhiteboardListener: Observable<
    OnUpdateWhiteboardSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateWhiteboard {
        onUpdateWhiteboard {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnUpdateWhiteboardSubscription>;

  OnDeleteWhiteboardListener: Observable<
    OnDeleteWhiteboardSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteWhiteboard {
        onDeleteWhiteboard {
          __typename
          id
          title
          defaultColor
          cards {
            __typename
            items {
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
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnDeleteWhiteboardSubscription>;

  OnCreatePlayerListener: Observable<OnCreatePlayerSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnCreatePlayer {
        onCreatePlayer {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnCreatePlayerSubscription>;

  OnUpdatePlayerListener: Observable<OnUpdatePlayerSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnUpdatePlayer {
        onUpdatePlayer {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnUpdatePlayerSubscription>;

  OnDeletePlayerListener: Observable<OnDeletePlayerSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnDeletePlayer {
        onDeletePlayer {
          __typename
          id
          sessionID
          session {
            __typename
            id
            title
            pincode
            players {
              __typename
              nextToken
              startedAt
            }
            whiteboardID
            whiteboard {
              __typename
              id
              title
              defaultColor
              _version
              _deleted
              _lastChangedAt
            }
            _version
            _deleted
            _lastChangedAt
          }
          fullName
          isTeacher
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnDeletePlayerSubscription>;

  OnCreateCardListener: Observable<OnCreateCardSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnCreateCard {
        onCreateCard {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnCreateCardSubscription>;

  OnUpdateCardListener: Observable<OnUpdateCardSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnUpdateCard {
        onUpdateCard {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnUpdateCardSubscription>;

  OnDeleteCardListener: Observable<OnDeleteCardSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnDeleteCard {
        onDeleteCard {
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
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<OnDeleteCardSubscription>;
}
