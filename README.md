# 1 – Integratie

De Realtime-Whiteboard applicatie is een PoC. Het project dient aan te tonen welke mogelijkheden het Amplify Framework kan bieden om realtime-data weer te geven. Om dat aan te tonen werd het Whiteboard project uitgebreid met een real-time module.
Omdat deze applicatie slechts een PoC is, wordt deze niet geïntegreerd in een bedrijf. De App wordt slechts voorgesteld aan het team van die Keure. 

## 1.1 – Wat heb je nodig?

- VS Code: Download Visual Studio Code op https://code.visualstudio.com/
- Node.js: Download en installeer Node.js op https://nodejs.org/en/download/
- Angular CLI: Installeer de Angular CLI via de node package manager. <br>
Gebruik daarvoor dit cmd: `npm install -g @angular/cli`

## 1.2 – Hoe ga je aan de slag?

### Stap 1 – Clone de Git repository en open deze in VS Code

Open een terminal en clone het project naar het systeem.

### Stap 2 – Installeer de node modules

`npm i`

### Stap 3 – API configureren 

Vanaf dit punt zijn er twee mogelijkheden om het project te runnen. 

#### Optie 1 – Bestaande API gebruiken
De eerste en snelste mogelijkheid is om te connecteren met de API gemaakt voor dit project. Deze API is geldig tot 31 juli 2020. Daarna zal de API-key vervallen.  Als je ervoor kiest om te connecteren met de bestaande API, dan hoef je het Amplify framework niet te configurern. Dit is de snelste manier om het project te starten. <br>

Maak een file aan genaamd aws-exports.js. <br>

Plaats de file in apps > realtime-whiteboard > src. <br>

Plaats onderstaande code in de file. <br>

```
const awsmobile = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id:
    'eu-west-1:6ffb3926-f9d8-4287-bca6-253c6700375d',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_CovhrsJwA',
  aws_user_pools_web_client_id: '13877nrrl5tih61mcb942oggbb',
  oauth: {},
  aws_user_files_s3_bucket: 'realtimewhiteboardstragebucket125040-dev',
  aws_user_files_s3_bucket_region: 'eu-west-1',
  aws_appsync_graphqlEndpoint:
    'https://amowajm2cfha5n5yahrjelwblu.appsync-api.eu-west-1.amazonaws.com/graphql',
  aws_appsync_region: 'eu-west-1',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: 'da2-grdmnz6fwbdt7mhvhyfoqz52ea '
};

export default awsmobile;
```


#### Optie 2 – Configureer een eigen Amplify project
Indien de bestaande API niet meer operationeel is, moet je zelf een Amplify project maken. Dit wil zeggen dat je een eigen Amplify app zult initialiseren en daar services zoals storage, authenticatie en AppSync zult aan toevoegen. Om dit te doen heb je een AWS account nodig. Om het account aan te maken heb je een creditcard nodig. <br>

##### Installeer Amplify Core

Open een terminal in de root van het project. Ga daarna naar de juiste applicatie

`cd apps/realtime-whiteboard`

Installeer Amplify Core

`npm i aws-amplify --save`

##### Installeer Amplify CLI

`npm install -g @aws-amplify/cli`

Configuratie van Amplify en AWS account

`amplify configure`

Dit cmd zal een browservenster openen. Volg de stappen in de browser om een AWS account aan te maken. Hiervoor heb je een creditcard nodig. Het is aangeraden om tijdens het maken van het account het Access Key ID en de Secret Access Key te bewaren. 
Doorloop volgende stappen om Amplify te configureren en de user te initialiseren:

`amplify configure`

```
Specify the AWS Region
? region:  eu-west-1
Specify the username of the new IAM user:
? user name:  amplify-viktor-mac
Enter the access key of the newly created user:
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
This would update/create the AWS Profile in your local machine
? Profile Name:  amplify-viktor-mac

Successfully set up the new user.
```

##### Verwijder de huidige Amplify folder
Voor de volgende stap moeten we de huidige Amplify folder verwijderen. Het is namelijk zo dat we deze files opnieuw zullen laten genereren met de configuratie van een nieuwe API. <br> 

De folder bevind zich onder apps > realtime-whiteboard > Amplify. <br>

##### Initialiseer Amplify
Initialiseer Amplify met 

`amplify init`

Doorloop volgende stappen:

```
? Enter a name for the project rtwhiteboardmac
? Enter a name for the environment dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building javascript
? What javascript framework are you using angular
? Source Directory Path:  src
? Distribution Directory Path: dist/realtime-whiteboard
? Build Command:  npm run-script build
? Start Command: ng serve
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use amplify-viktor-mac
```

##### API toevoegen
Voeg de API toe met 

`amplify add api`

Doorloop volgende stappen:

```
? Please select from one of the below mentioned services: GraphQL
? Provide API name: rtwhiteboardmac
? Choose the default authorization type for the API API key
? Enter a description for the API key: my key
? After how many days from now the API key should expire (1-365): 7
? Do you want to configure advanced settings for the GraphQL API Yes, I want to make some additional changes.
? Configure additional auth types? No
? Configure conflict detection? Yes
? Select the default resolution strategy Auto Merge
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now? Yes
```

Pas het standaard schema aan naar deze models:

```
type Session @model {
 id: ID!
 title: String!
 pincode: Int!
 players: [Player] @connection(keyName: "bySession", fields: ["id"])
 whiteboardID: ID!
 whiteboard: Whiteboard @connection(fields: ["whiteboardID"])
}

type Whiteboard @model {
 id: ID!
 title: String
 defaultColor: String
 cards: [Card] @connection(keyName: "byWhiteboard", fields: ["id"])
}

type Player
 @model
 @key(
   name: "bySession"
   fields: ["sessionID"]
   queryField: "playerBySessionID"
 ) {
 id: ID!
 sessionID: ID!
 session: Session @connection(fields: ["sessionID"])
 fullName: String!
 isTeacher: Boolean!
}

type Card
 @model(subscriptions: null)
 @key(
   name: "byWhiteboard"
   fields: ["whiteboardID"]
   queryField: "cardByWhiteboardID"
 ) {
 id: String!
 whiteboardID: ID!
 whiteboard: Whiteboard @connection(fields: ["whiteboardID"])
 mode: Int!
 type: Int!
 color: String!
 description: String
 image: String
 top: Int!
 left: Int!
 viewModeImage: Boolean!
 inShelf: Boolean!
 createdBy: String!
 lastUpdatedBy: String
}

type Subscription {
 onCardAddedInWhiteboard(whiteboardID: ID!): Card
   @aws_subscribe(mutations: ["createCard"])
 onCardChangedInWhiteboard(whiteboardID: ID!): Card
   @aws_subscribe(mutations: ["updateCard"])
 onCardRemovedInWhiteboard(whiteboardID: ID!): Card
   @aws_subscribe(mutations: ["deleteCard"])
}
```


##### Authentication toevoegen
Voeg authenticatie toe met 

`amplify add auth`

Doorloop deze stappen

```
 Do you want to use the default authentication and security configuration? Default configuration
 How do you want users to be able to sign in? Username
 Do you want to configure advanced settings? No, I am done.
```

##### Storage toevoegen
Voeg storage toe met

`amplify add storage`

Doorloop deze stappen

```
? Please select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Please provide a friendly name for your resource that will be used to label this category in the project: rtwhiteboardmacstorage
? Please provide bucket name: rtwiteboardmacbucket
? Who should have access: Auth and guest users
? What kind of access do you want for Authenticated users? create/update, read, delete
? What kind of access do you want for Guest users? create/update, read, delete
? Do you want to add a Lambda Trigger for your S3 Bucket? No
```

##### Push de resources naar de cloud configuratie
Controleer de huidige status van de resources met 

`amplify status`

Push de resources

`amplify push`

```
✔ Successfully pulled backend environment dev from the cloud.

Current Environment: dev

| Category | Resource name           | Operation | Provider plugin   |
| -------- | ----------------------- | --------- | ----------------- |
| Api      | rtwhiteboardmac         | Create    | awscloudformation |
| Auth     | rtwhiteboardmac0a3ba133 | Create    | awscloudformation |
| Storage  | rtwhiteboardmacstorage  | Create    | awscloudformation |

? Are you sure you want to continue? Yes
? Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target angular
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.graphql
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
? Enter the file name for the generated code src/app/API.service.ts
```

##### Maak de storage bucket public
Een standaard S3 bucket is niet toegankelijk voor alle users. De bucket policy moet aangepast worden zodat afbeeldingen kunnen gedownload worden. <br>

Ga naar de amplify console met het cmd 

`amplify console`

Selecteer de applicatie die we in de vorige stap hebben geïnitialiseerd. <br>
Ga naar ‘Backend environments’ → ‘File Storage’ → ‘View in S3’ → ‘Permissions’ → ‘Bucket Policy’. <br>

Plaats daar deze code:

```
{
    "Version": "2012-10-17",
    "Id": "Policy1589285065543",
    "Statement": [
        {
            "Sid": "Stmt1589285058091",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::rtwiteboardmacbucket142722-dev/*"
        }
    ]
}
```


Pas het ‘Resource’ veld aan naar de naam van je eigen resource. Deze kun je vinden in de tekst boven de ‘policy-editor’.

#### Stap 4 – Run het project

Run het project met

`ng serve realtime-whiteboard`

