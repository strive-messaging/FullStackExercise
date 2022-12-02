import { Dispatch, SetStateAction } from "react"

export interface TextFlowProps {
  query: string;
  isAwaitingUserInput: boolean;
  setQuery: Dispatch<SetStateAction<string>>;
  moveFlow: any;
}

export default function TextFlow({
  query,
  setQuery,
  moveFlow,
  isAwaitingUserInput,
}: TextFlowProps) {
  return (
    <div className="border-solid border border-slate-100 my-1 sm:rounded-lg">
      <input
        className="w-full"
        value={query}
        disabled={!isAwaitingUserInput}
        onChange={({ target }) => setQuery(target.value)}
        onKeyDown={({ key }) => key === 'Enter' && moveFlow()}
        placeholder="Send message"
      />
    </div>
  );
}
