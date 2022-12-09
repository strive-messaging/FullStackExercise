import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Member } from "@/lib/models";

interface Props {
    flowId: number
}

type Message = string // likely to evolve pretty quickly

async function simulateFlow(
    flowId: number,
    member: Member,
    message: Message = '',
    index: number = 0
) {
    const res = await fetch(`/api/flows/${flowId}/simulate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            member,
            message,
            startIndex: index,
        }),
    })

    if (!res.ok) {
        throw new Error(`HTTP Error. Status: ${res.status}`)
    }

    return res.json()
}

export default function FlowSim(props: Props) {
    // This format provided for convenience. Please change if necessary.
    const [messages, setMessages] = useState<Message[]>([]);
    const [submission, setSubmission] = useState<Message>('');
    const [input, setInput] = useState<string>('');
    const [index, setIndex] = useState(0);

    // TODO: Switch to real memeber when needed.
    const member: Member = {
        id: 123,
        name: 'fake-name',
        phoneNumber: 'fake-phone-number',
        email: 'fake-email',
        isSubscribed: true,
    }

    useEffect(() => {
        console.log("change flow id");
        simulateFlow(props.flowId, member, "", 0)
            .then((res) => {
                if (res.ok) {
                    setMessages(res.messages);
                    setIndex(res.stopIndex)
                    setInput("");
                } else {
                    console.error("SeverError: ", res.error);
                }

                setInput('');
            })
            .catch(console.error)
    }, [props.flowId]);

    useEffect(() => {
        if (submission == '') return;

        simulateFlow(props.flowId, member, submission, index)
            .then((res) => {
                if (res.ok) {
                    setMessages(messages.concat(res.messages));
                    setIndex(res.stopIndex)
                } else {
                    console.error("SeverError: ", res.error);
                }

                setInput('');
            })
            .catch(console.error)
    }, [submission]);

    const handleInputKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Enter") {
            setMessages([...messages, input]);
            setSubmission(input);
        }
    };

    const handleInputChange = (e: ChangeEvent) => {
        setInput((e.target as HTMLInputElement).value);
    };

    // TODO: handle scroll overflow
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="border-solid border-2 border-indigo-600 h-64">
                    {messages.map((m, i) => (
                        <div key={i} className="m-1 bg-slate-200">{m}</div>
                    ))}
                </div>
                <div className="border-solid border border-slate-100 my-1">
                    <input
                        className="w-full"
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Type message and hit Enter to send"
                        value={input}
                    />
                </div>
            </div>
        </div>
    )
}