import { Dispatch, SetStateAction } from "react";
import { Message } from '@/lib/models'

export interface FlowChooserProps {
  flowHeader: string,
  setMessageFeed: Dispatch<SetStateAction<Message[]>>;
  setFlowId: Dispatch<SetStateAction<number>>;
  setIsAwaitingUserInput: Dispatch<SetStateAction<boolean>>,
  setQuery: Dispatch<SetStateAction<string>>;
}

export default function FlowChooser({
  flowHeader,
  setMessageFeed,
  setFlowId,
  setIsAwaitingUserInput,
  setQuery,
}: FlowChooserProps) {
  return (
    <div className="flex sm:mx-auto sm:w-full sm:max-w-2xl justify-between items-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {flowHeader}
      </h1>

      <div>
        <select
          className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          onChange={({ target }) => {
            setMessageFeed([])
            setFlowId(parseInt(target.value || '1', 10))
            setIsAwaitingUserInput(true)
            setQuery('')
          }}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </div>
    </div>
  );
}
