// Models File
// Normally, an ORM or some kind of data layer would go here,
// but we don't really expect this toy app to talk to a DB for real.

export interface Flow {
  id: number
  name: string
  definition: FlowAction[]
}

export interface FlowMessageAction {
  type: 'message'
  message: string
}

export interface FlowGetInfoAction {
  type: 'getInfo'
  message: string
  key: keyof Member
  response: string
}

export interface FlowMultipleChoiceAction {
  type: 'multipleChoice'
  message: string
  responses: {
    value: string
    message: string
    synonyms: string[]
  }[]
  invalidResponse: string
}

export type FlowAction = FlowMessageAction | FlowMultipleChoiceAction | FlowGetInfoAction

export interface Member {
  [key: string]: number | string | boolean
  id: number
  name: string
  email: string
  phoneNumber: string
  isSubscribed: boolean
}

export interface MemberMessage {
  message: string
  isMember: boolean
}

// Flows Array
// Normally this would be in a database, but is just here for convenience.
export const FLOWS: Flow[] = [
  {
    id: 1,
    name: 'Hello World Flow',
    definition: [
      { type: 'message', message: 'hello' },
      { type: 'message', message: 'goodbye' },
    ],
  },
  {
    id: 2,
    name: 'Multiple Choice Flow',
    definition: [
      { type: 'message', message: 'Thank you for texting in' },
      {
        type: 'multipleChoice',
        message: 'What is your favorite color?',
        responses: [
          { value: 'red', message: 'You responded "red".', synonyms: [] },
          { value: 'green', message: 'You responded "green".', synonyms: [] },
          { value: 'blue', message: 'You responded "blue".', synonyms: ['navy'] },
        ],
        invalidResponse: "We aren't familiar with that one. Try again.",
      },
      {
        type: 'multipleChoice',
        message: 'Are you sure? (yes/no)',
        responses: [
          { value: 'yes', message: 'You are sure!', synonyms: ['true', 'yup', 'y'] },
          { value: 'no', message: 'You are not sure.', synonyms: ['false', 'nope', 'n'] },
        ],
        invalidResponse: "We aren't familiar with that one. Try again.",
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
        response: 'Thank you for sending in your name!',
      },
      { type: 'message', message: 'Thanks again!' },
      {
        type: 'getInfo',
        message: 'What is your email?',
        key: 'email',
        response: 'Thanks for the info! We will respect your privacy.',
      },
    ],
  },
]
