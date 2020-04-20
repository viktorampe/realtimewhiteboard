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
  whiteboard: string;
};

export type ModelSessionConditionInput = {
  title?: ModelStringInput | null;
  pincode?: ModelIntInput | null;
  whiteboard?: ModelStringInput | null;
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

export type UpdateSessionInput = {
  id: string;
  title?: string | null;
  pincode?: number | null;
  whiteboard?: string | null;
};

export type DeleteSessionInput = {
  id?: string | null;
};

export type CreatePlayerInput = {
  id?: string | null;
  sessionID: string;
  fullName: string;
};

export type ModelPlayerConditionInput = {
  sessionID?: ModelIDInput | null;
  fullName?: ModelStringInput | null;
  and?: Array<ModelPlayerConditionInput | null> | null;
  or?: Array<ModelPlayerConditionInput | null> | null;
  not?: ModelPlayerConditionInput | null;
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

export type UpdatePlayerInput = {
  id: string;
  sessionID?: string | null;
  fullName?: string | null;
};

export type DeletePlayerInput = {
  id?: string | null;
};

export type ModelSessionFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  pincode?: ModelIntInput | null;
  whiteboard?: ModelStringInput | null;
  and?: Array<ModelSessionFilterInput | null> | null;
  or?: Array<ModelSessionFilterInput | null> | null;
  not?: ModelSessionFilterInput | null;
};

export type ModelPlayerFilterInput = {
  id?: ModelIDInput | null;
  sessionID?: ModelIDInput | null;
  fullName?: ModelStringInput | null;
  and?: Array<ModelPlayerFilterInput | null> | null;
  or?: Array<ModelPlayerFilterInput | null> | null;
  not?: ModelPlayerFilterInput | null;
};

export type CreateSessionMutation = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type UpdateSessionMutation = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type DeleteSessionMutation = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
};

export type GetSessionQuery = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type ListSessionsQuery = {
  __typename: "ModelSessionConnection";
  items: Array<{
    __typename: "Session";
    id: string;
    title: string;
    pincode: number;
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null> | null;
  nextToken: string | null;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
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
      whiteboard: string;
    } | null;
    fullName: string;
  } | null> | null;
  nextToken: string | null;
};

export type OnCreateSessionSubscription = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnUpdateSessionSubscription = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnDeleteSessionSubscription = {
  __typename: "Session";
  id: string;
  title: string;
  pincode: number;
  whiteboard: string;
  players: {
    __typename: "ModelPlayerConnection";
    items: Array<{
      __typename: "Player";
      id: string;
      sessionID: string;
      fullName: string;
    } | null> | null;
    nextToken: string | null;
  } | null;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
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
    whiteboard: string;
    players: {
      __typename: "ModelPlayerConnection";
      nextToken: string | null;
    } | null;
  } | null;
  fullName: string;
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
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
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
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
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
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
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
  async GetSession(id: string): Promise<GetSessionQuery> {
    const statement = `query GetSession($id: ID!) {
        getSession(id: $id) {
          __typename
          id
          title
          pincode
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          nextToken
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
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
              whiteboard
            }
            fullName
          }
          nextToken
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
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
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
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
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
          whiteboard
          players {
            __typename
            items {
              __typename
              id
              sessionID
              fullName
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnDeleteSessionSubscription>;

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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
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
            whiteboard
            players {
              __typename
              nextToken
            }
          }
          fullName
        }
      }`
    )
  ) as Observable<OnDeletePlayerSubscription>;
}
