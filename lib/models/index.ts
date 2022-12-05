// Models File
// Normally, an ORM or some kind of data layer would go here,
// but we don't really expect this toy app to talk to a DB for real.

export interface Flow {
  id: number;
  name: string;
  definition: FlowAction[]
}

export interface FlowMessageAction {
  type: 'message'
  message: string
}

export interface FlowGetInfoAction {
  type: 'getInfo',
  message: string,
  key: keyof Member
}

export interface FlowMultipleChoiceAction {
  type: 'multipleChoice';
  message: string;
  responses: {
    value: string
    message: string
    synonyms: string[]
  }[]
}

export type FlowAction = FlowMessageAction | FlowMultipleChoiceAction | FlowGetInfoAction

export interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  isSubscribed: boolean;
}
export interface Message {
  message: string;
  userMessage: boolean;
}
export interface MessageResponse {
  messages: Message[],
  stopIndex: number,
  member?: Member
}

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  organizationId: number;
}

// Flows Array
// Normally this would be in a database, but is just here for convenience.
export const FLOWS: Flow[] = [
  {id: 1, name: 'Hello World Flow', definition: [{type: 'message', message: 'hello'}]},
  {
    id: 2, name: 'Multiple Choice Flow', definition: [
      {type: 'message', message: 'Thank you for texting in'},
      {
        type: 'multipleChoice',
        message: 'What is your favorite color?',
        responses: [
          {
            value: 'red',
            message: 'You responded "red".',
            synonyms: ['pink', 'crimson', 'magenta', 'scarlet', 'sapphire']
          },
          {value: 'green', message: 'You responded "green".', synonyms: ['jade', 'lime', 'sage', 'olive']},
          {value: 'blue', message: 'You responded "blue".', synonyms: ['azure', 'navy', 'indigo', 'cobalt']},
          {value: 'yellow', message: 'You responded "yellow".', synonyms: ['lemon', 'amber', 'gold']},
          {value: 'orange', message: 'You responded "orange".', synonyms: []},
          {value: 'black', message: 'You responded "black".', synonyms: []},
          {value: 'gray', message: 'You responded "gray".', synonyms: ['grey']},
          {
            value: 'purple',
            message: 'You responded "purple".',
            synonyms: ['lavender', 'lilac', 'plum', 'violet', 'amethyst']
          },
          {value: 'white', message: 'You responded "white".', synonyms: []},
        ]
      },
    ]
  },
  {
    id: 3, name: 'Asking Question Flow', definition: [
      {type: 'getInfo', message: 'What is your name?', key: 'name'},
      {type: 'message', message: 'Thank you for sending in your name!'}
    ]
  }
]

export const MEMBER: Member = {
  id: 111,
  name: 'Susan',
  email: 'malmrosesusan@gmail.com',
  phoneNumber: '714-552-7175',
  isSubscribed: true,
}
