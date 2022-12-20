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

enum MemberData {
  id = 'id',
  name = 'name',
  email = 'email',
  phoneNumber = 'phoneNumber',
  isSubscribed = 'isSubscribed'
}

const { id, name, email, phoneNumber, isSubscribed } = MemberData

export type Member = {
  [id]: number;
  [name]: string;
  [email]: string;  
  [phoneNumber]: string;  
  [isSubscribed]: boolean;
}


export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  organizationId: number;
}

export const FLOW_END: string = 'EOF';
// Flows Array
// Normally this would be in a database, but is just here for convenience.
export const FLOWS: Flow[] = [
  { id: 1, name: 'Hello World Flow', definition: [{ type: 'message', message: 'hello' }] },
  {
      id: 2, name: 'Multiple Choice Flow', definition: [
          { type: 'message', message: 'Thank you for texting in' },
          {
              type: 'multipleChoice',
              message: 'What is your favorite color?',
              responses: [
                  { value: 'red', message: 'You responded "red".', synonyms: [] },
                  { value: 'green', message: 'You responded "green".', synonyms: [] },
                  { value: 'blue', message: 'You responded "blue".', synonyms: [] },
              ]
          }
      ]
  },
  {
      id: 3, name: 'Asking Question Flow',
      definition: Object.values(MemberData)
                    .filter(key => key !== 'id' && key !== 'isSubscribed')
                    .reduce((acc: Array<FlowGetInfoAction|FlowMessageAction>, key) => [
                          ...acc, 
                          { type: 'getInfo', message: `What is your ${key as string}?`, key }, 
                          { type: 'message', message: `Thank you for sending in your ${key as string}!` } 
                        ], [])
  }
]
