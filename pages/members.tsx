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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center m-4">
          Member List
        </h1>

        <div className="text-center">
          {memberList.length
            ? memberList.map(({
                name,
                email,
                phoneNumber,
                isSubscribed,
              }, i) =>
                <div key={i}>
                  <span>{name}</span>
                  <span>{email}</span>
                  <span>{phoneNumber}</span>
                  <span>{isSubscribed}</span>
                </div>
              )
            : <span>No Members</span>
          }
        </div>
      </main>

      <Footer />
    </div>
  )
}
