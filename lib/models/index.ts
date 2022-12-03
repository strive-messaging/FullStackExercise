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

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  organizationId: number;
}

export interface Message {
  message: string;
  type?: string;
  responses?: any[];
  isMemberInput?: boolean;
}

// Flows Array
// Normally this would be in a database, but is just here for convenience.
// email
// phoneNumber
// isSubscribed
export const FLOWS: Flow[] = [
  {
    id: 1,
    name: 'New Member Flow',
    definition: [
      {
        type: 'getInfo',
        message: 'What is your name?',
        key: 'name',
      },
      {
        type: 'message',
        message: 'Thank you for sending in your name!',
      },
      {
        type: 'getInfo',
        message: 'What is your email?',
        key: 'email',
      },
      {
        type: 'message',
        message: 'Thank you for sending in your email!',
      },
      {
        type: 'multipleChoice',
        message: 'Subscribe for updates?',
        responses: [
          {
            value: 'Yes, please omg',
            message: 'Thanks for subscribing!',
            synonyms: [],
          },
          {
            value: 'Never in a million years',
            message: 'A simple "no" would\'ve sufficed..',
            synonyms: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Multiple Choice Flow',
    definition: [
      {
        type: 'message',
        message: 'Thank you for texting in',
      },
      {
        type: 'multipleChoice',
        message: 'What is your favorite color?',
        responses: [
          {
            value: 'red',
            message: 'You responded "red".',
            synonyms: [],
          },
          {
            value: 'green',
            message: 'You responded "green".',
            synonyms: [],
          },
          {
            value: 'blue',
            message: 'You responded "blue".',
            synonyms: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Asking Question Flow',
    definition: [
      {
        type: 'getInfo',
        message: 'What is your name?',
        key: 'name',
      },
      {
        type: 'message',
        message: 'Thank you for sending in your name!',
      },
    ],
  },
]

export const MEMBERS: Member[] = [
]
