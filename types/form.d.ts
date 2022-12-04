
export interface FieldPermission {
  key: string
  edit: boolean
}

export interface FieldDefinition {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'email' | 'boolean' | 'option'
  options?: string[]
  rowSpan?: number
}

export interface FlowResult {
  flowName?: string;
  messages: Message[];
  stopIndex: number;
  member: Member;
}
