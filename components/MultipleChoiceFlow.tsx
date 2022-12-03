export interface MultipleChoiceFlowProps {
  responses: any[];
  moveFlow: any;
  isAwaitingUserInput: boolean;
}

export default function MultipleChoiceFlow({
  responses,
  moveFlow,
  isAwaitingUserInput,
}: MultipleChoiceFlowProps) {
  return (
    <div className="flex g-4 w-fill justify-center space-x-2 rounded-xl bg-gray-200 p-2">
      {isAwaitingUserInput
        ? responses.map(({ value, message }, i) =>
            <button
              key={i}
              className="flex-grow cursor-pointer select-none rounded-xl p-2 text-center bg-blue-500 font-bold text-white hover:bg-blue-700 focus:bg-blue-700"
              onKeyDown={({ key }) => key === 'Enter' && moveFlow(message)}
              onClick={() => moveFlow(message)}
            >
              {value}
            </button>
          )
        : <span>Already answered</span>
      }
    </div>
  );
}
