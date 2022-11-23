import { FieldPermission, FieldDefinition } from "@/types/form"

const PERMISSION_FIXTURE_ONE: FieldPermission[] = [
  {key: 'firstName', edit: true},
  {key: 'firstName', edit: false},
  {key: 'lastName', edit: true},
  {key: 'lastName', edit: false},
  {key: 'birthdate', edit: true},
  {key: 'birthdate', edit: false}
]

const PERMISSION_FIXTURE_TWO: FieldPermission[] = [
  {key: 'firstName', edit: true},
  {key: 'firstName', edit: false},
  {key: 'lastName', edit: true},
  {key: 'lastName', edit: false},
  {key: 'email', edit: false},
  {key: 'isSubscribed', edit: false}
]

const PERMISSION_FIXTURE_THREE: FieldPermission[] = [
  {key: 'firstName', edit: true},
  {key: 'firstName', edit: false},
  {key: 'zipcode', edit: true},
  {key: 'zipcode', edit: false},
  {key: 'custom_SecretFavoriteColor', edit: true}
]

export async function getPermissions(userId: number) {
  return {
    1: PERMISSION_FIXTURE_ONE,
    2: PERMISSION_FIXTURE_TWO,
    3: PERMISSION_FIXTURE_THREE
  }[userId.toString()]
}