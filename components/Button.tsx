import tw from "twin.macro";
import styled from '@emotion/styled';

export const PrimaryButton = styled.button(tw`bg-green-500 text-white px-4 py-2 m-1 rounded-md hover:bg-green-400 disabled:bg-gray-200`); 
export const SecondaryButton = tw(PrimaryButton)`bg-red-400 hover:bg-red-100 disabled:bg-gray-200`;