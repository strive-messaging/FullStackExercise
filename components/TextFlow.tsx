import { Message } from "@/lib/models";
import { Dispatch, SetStateAction } from "react"

export interface TextFlowProps {
  query: string;
  isAwaitingUserInput: boolean;
  moveFlow: any;
  setQuery: Dispatch<SetStateAction<string>>;
  setMessageFeed: Dispatch<SetStateAction<Message[]>>;
}

export default function TextFlow({
  query,
  isAwaitingUserInput,
  moveFlow,
  setQuery,
  setMessageFeed,
}: TextFlowProps) {

  const addToMessageFeed = (message: string) => {
    setMessageFeed(oldState => [...oldState, { message, isMemberInput: true }])
    moveFlow()
    setQuery('')
  }

  return (
    <div className="flex g-4 w-fill justify-center space-x-2 rounded-xl bg-gray-200 p-2">
      {isAwaitingUserInput
        ? <>
            <input
              className="border rounded w-full h-full text-center focus:outline-none focus:shadow-outline text-3xl sm:rounded-lg"
              value={query}
              onChange={({ target }) => setQuery(target.value)}
              onKeyDown={({ key }) => key === 'Enter' && addToMessageFeed(query)}
              placeholder="Reply here :)"
            />

            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 sm:rounded-lg disabled:hover:bg-green-500 disabled:opacity-50"
              onKeyDown={({ key }) => key === 'Enter' && addToMessageFeed(query)}
              onClick={() => query && addToMessageFeed(query)}
              disabled={!query}
            >
              Submit
            </button>

            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 sm:rounded-lg"
              onKeyDown={({ key }) => key === 'Enter' && setQuery('')}
              onClick={() => setQuery('')}
            >
              Clear
            </button>
          </>
        : <span>Already answered</span>
      }
    </div>
  );
}
