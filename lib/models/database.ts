/**
 * Fake database to look up member.
 */

import { Member } from '../models'

/**
 * Fake table
 */
export const FAKE_MEMBERS_TABLE: Member[] = [
  {
    id: 418,
    name: 'Jake Dolan',
    email: 'jake@cascadin.com',
    phoneNumber: '406-570-3068',
    isSubscribed: false,
  },
]

/**
 * Look up Member by Phone Number.
 */
export const getMemberByPhoneNumber = async (phoneNumber: string) => {
  return FAKE_MEMBERS_TABLE.find((member) => member.phoneNumber === phoneNumber)
}

/**
 * Update Member Key.
 */
export const updateMemberKey = async (
  memberId: number,
  key: keyof Member,
  value: number | string | boolean
) => {
  if (key === 'id') return

  const i = FAKE_MEMBERS_TABLE.findIndex((member) => member.id === memberId)
  if (i !== -1) {
    FAKE_MEMBERS_TABLE[i][key] = value
  }
}
