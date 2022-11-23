import Head from 'next/head'
import Image from 'next/image'

import { FieldPermission, FieldDefinition } from '@/types/form'
import { getPermissions } from '@/lib/permissions'
import { useState } from 'react'

import example from '../public/example.png'

async function getUserPermissions(userId: number) {
  return getPermissions(userId)
}

const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    key: 'birthdate',
    label: 'Birthday',
    type: 'date',
  },
  {
    key: 'isSubscribed',
    label: 'Subscribed',
    type: 'boolean',
  },
  {
    key: 'zipcode',
    label: 'Zip',
    type: 'number',
  },
  {
    key: 'custom_SecretFavoriteColor',
    label: 'Favorite Color (secret)',
    type: 'option',
    options: ['red', 'green', 'blue'],
  },
]

export default function Home() {
  const [userId, setUserId] = useState(1)
  const [permissions, setPermissions] = useState([] as FieldPermission[])

  // Feel free to "query" getUserPermissions in this file. (Or do it elsewhere! Up to you!)

  return (
    <div className="h-screen bg-gray-50">
      <Head>
        <title>Strive Member Form Exercise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Please display member fields here
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We want the form to support two columns and to provide the ability to &quot;span&quot;
              an input over more than one row.
            </p>
          </div>
          <div className="mt-8 mx-auto max-w-sm text-center">
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => setUserId(parseInt(e.target.value || '1', 10))}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <p className="mt-2 text-center text-sm text-gray-600">
              Feel free to use (or not use) this selector to flip between permission lists. Three
              are provided.
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Input One</label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Input Two</label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="relative mt-8 mb-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">Trivial Example</span>
            </div>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
            <Image alt="form example" src={example} />
          </div>
        </div>
      </main>
    </div>
  )
}
