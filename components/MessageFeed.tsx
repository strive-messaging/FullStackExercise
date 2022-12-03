import { Message } from '@/lib/models'

export interface MessageFeedProps {
  messageFeed: Message[];
  scriptedMessages: Message[];
  isAwaitingUserInput: boolean;
}

export default function MessageFeed({
  messageFeed,
  scriptedMessages,
  isAwaitingUserInput,
}: MessageFeedProps) {
  return (
    <div className="flex bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex-grow">
      <div className="border-solid border-2 border-indigo-600 flex-grow">
        {messageFeed.map(({ message, isMemberInput }, i) => (
          !isMemberInput || scriptedMessages.map(({ message }) => message).includes(message)
            ? <div key={i} className="m-1 bg-slate-200 font-medium p-2">
                {message}
              </div>
            : <div key={i} className="m-1 bg-indigo-200 p-2">
                {message}
              </div>
        ))}
        {!isAwaitingUserInput &&
          <div key='end' className="m-4 text-center p-2 italic">
            End of flow
          </div>
        }
      </div>
    </div>
  );
}
