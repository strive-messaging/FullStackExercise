import tw from "twin.macro";
import styled from '@emotion/styled';

export const MachineMessage = styled.div(tw`m-1 bg-gray-50 hover:bg-gray-100 cursor-default`);
export const UserMessage = tw(MachineMessage)`bg-green-50 hover:bg-green-100 text-right`;
export const EOFMessage = tw(MachineMessage)`bg-red-50 hover:bg-red-100 text-center`;