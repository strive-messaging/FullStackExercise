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
    <div className="h-16 flex gap-2 border-solid border border-slate-100 my-1 sm:rounded-lg">
      <input
        className="border rounded w-full h-full text-center focus:outline-none focus:shadow-outline text-3xl"
        value={query}
        disabled={!isAwaitingUserInput}
        onChange={({ target }) => setQuery(target.value)}
        onKeyDown={({ key }) => key === 'Enter' && moveFlow()}
        placeholder="Send message"
      />

      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onKeyDown={({ key }) => key === 'Enter' && setQuery('')}
        onClick={() => setQuery('')}
      >
        Clear
      </button>
    </div>
  );
}
