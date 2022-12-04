import { Member } from '@/lib/models'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function fetchMembers(): Promise<Member[]> {
  const res = await fetch(`/api/members`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return res.json()
}

export default function Members() {
  const [memberList, setMemberList] = useState([] as Member[])

  useEffect(() => {
    fetchMembers().then(setMemberList)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header pageName="Home" url="/"/>

      <main className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col flex-grow mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center m-4">
            Member List
          </h1>

          {memberList.length
            ? memberList.map(({
                name,
                email,
                phoneNumber,
                isSubscribed,
              }, i) =>
                <div key={i} className="flex justify-between">
                  <div>Name: {name}</div>
                  <div>Email: {email}</div>
                  <div>PhoneNumber: {phoneNumber ?? 'n/a'}</div>
                  <div>IsSubscribed: {isSubscribed ? 'Yep' : 'Nope'}</div>
                </div>
              )
            : <span className='text-center'>No Members</span>
          }
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
