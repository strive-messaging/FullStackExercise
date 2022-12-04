import { Message } from "@/lib/models";
import { Dispatch, SetStateAction } from "react";

export interface MultipleChoiceFlowProps {
  responses: any[];
  moveFlow: any;
  isAwaitingUserInput: boolean;
  setMessageFeed: Dispatch<SetStateAction<Message[]>>;
}

export default function MultipleChoiceFlow({
  responses,
  moveFlow,
  isAwaitingUserInput,
  setMessageFeed,
}: MultipleChoiceFlowProps) {

  const addToMessageFeed = (userResponse:string, message: string) => {
    setMessageFeed(oldState => [
      ...oldState,
      { message: userResponse, isMemberInput: true },
      { message },
    ])
    moveFlow(userResponse)
  }

  return (
    <div className="flex g-4 w-fill justify-center space-x-2 rounded-xl bg-gray-200 p-2">
      {isAwaitingUserInput
        ? responses.map(({ message, value }, i) =>
            <button
              key={i}
              className="flex-grow cursor-pointer select-none rounded-xl p-2 text-center bg-blue-500 font-bold text-white hover:bg-blue-700 focus:bg-blue-700"
              onKeyDown={({ key }) => key === 'Enter' && addToMessageFeed(value, message)}
              onClick={() => addToMessageFeed(value, message)}
            >
              {value}
            </button>
          )
        : <span>Already answered</span>
      }
    </div>
  );
}
