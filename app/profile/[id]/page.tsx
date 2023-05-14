/* app/profile/[id]/page.tsx */
'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { client, getPublications, getProfile } from '../../../api'
import Link from "next/link"


export default function Profile() {
  /* create initial state to hold user profile and array of publications */
  const [profile, setProfile] = useState<any>()
  const [publications, setPublications] = useState<any>([])
  /* using the router we can get the lens handle from the route path */
  const pathName = usePathname()
  const handle = pathName?.split('/')[2]
  
  
  useEffect(() => {
    if (handle) {
      fetchProfile()
    }
  }, [handle])

  async function fetchProfile() {
    try {
      /* fetch the user profile using their handle */
      const returnedProfile = await client.query({
        query: getProfile,
        variables: { handle }
      })
      const profileData = await { ...returnedProfile.data.profile }
      /* format their picture if it is not in the right format */
      const picture = profileData.picture
      if (picture && picture.original && picture.original.url) {
        if (picture?.original?.url?.startsWith('ipfs://')) {
          let result = picture.original?.url?.substring(7, picture.original.url.length)
          profileData.avatarUrl = `https://lens.infura-ipfs.io/ipfs/${result}`
        } else {
          profileData.avatarUrl = profileData.picture?.original?.url
        }
      }
      

      const coverPicture = profileData.coverPicture
      if (coverPicture && coverPicture.original && coverPicture.original.url) {
        if (coverPicture.original?.url?.startsWith('ipfs://')) {
          let result = coverPicture.original?.url?.substring(7, coverPicture.original.url.length)
          profileData.coverUrl = `https://lens.infura-ipfs.io/ipfs/${result}`
        } else {
          profileData.coverUrl = profileData.coverPicture?.original?.url
        }
      }

      setProfile(profileData)
      console.log(profileData)
      
            /* fetch the user's publications from the Lens API and set them in the state */
      const pubs = await client.query({
        query: getPublications,
        variables: {
            id: profileData.id,
        }
      })
      setPublications(pubs.data.publications.items)
      console.log(pubs.data.publications.items)
      // console.log(pubs.data.publications.items)
    } catch (err) {
      console.log('error fetching profile...', err)
    }
  }

  if (!profile) return null

  return (
    <>

    <div className=''>
      <div className="">
      <section className="mb-32 text-gray-800">
        <div className="bg-white">
        <Image width="600" height="600" src={profile?.coverUrl || "/profile-icon.png"} alt="Cover Image" className="w-full max-h-[500px] object-cover absolute"/>
          <div className="flex flex-wrap items-center">
            <div className="hidden lg:flex mt-64 grow-0 relative shrink-0 basis-auto lg:w-9/12 xl:w-4/12">
              <Image width="600" height="600" src={profile?.avatarUrl || "/profile-icon.png"} alt="Profile"
                  className="w-9/12 h-96 object-cover ml-10 rounded-full" />
            </div>
            <div className="grow-0 relative shrink-0 basis-auto lg:w-6/12 xl:w-8/12">
            <div className="px-6 py-12 mt-80 shadow-lg md:px-12 w-9/12 bg-white rounded-xl">
              <div>
               <h2 className="text-2xl font-bold mb-2">{profile?.name}</h2>
               <h2 className="text-cyan-400 mb-2">@{profile?.handle}</h2>
                <p className="uppercase text-red-600 font-bold mb-6 flex items-center">
                 {profile?.bio}
                </p>
              </div>   
              <div className="flex justify-between w-6/12">
                  <p className="text-gray-500 mb-6">
                    Followers: <span className="font-semibold text-[#000]">{profile?.stats?.totalFollowers}</span>         
                  </p>
                  <p className="text-gray-500 mb-6 ml-6">
                    Following: <span className="font-semibold text-[#000]">{profile?.stats?.totalFollowing}</span> 
                  </p>
              </div> 
              <div className="flex justify-between m-auto">
                  {profile?.attributes.map((e : any) => {
                    if (e.key == "location") {
                    return (
                    <p key={e.value} className="text-gray-500 mb-6">
                    Location:<span className="font-semibold text-[#000]">{e.value}</span></p> 
                    )
                    }else if (e.key == "website"){
                      return (
                        <p key={e.value} className="text-gray-500 mb-6">
                        Website:<a className="font-semibold underline cursor-pointer text-[#000]" target="_blank" href={e.value}>{e.value}</a></p> 
                      )
                    }else if (e.key == "twitter"){
                      return (
                        <p key={e.value} className="text-gray-500 mb-6">
                        Twitter:<a className="font-semibold underline text-[#000]" href={`https://twitter.com/${e.value}`} target="_blank" >
                          {e.value}
                        </a></p> 
                      )
                    }
                  })}
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>            
      </div>

      <div className='flex flex-col justify-center items-center'>
        {
            publications.map((pub: any) => (
              <>
              
              <div key={pub?.id} className='shadow p-8 rounded mb-8 w-2/3'>
                <div className="mb-5 flex flex-row">
                <Image width="600" height="600"
                  src={profile?.avatarUrl || "/profile.png"}
                  className="w-12 h-12 rounded-full shadow-lg border border-zinc-900"
                  alt="Avatar" />
                  <div className="ml-3">
                    <div className="flex flex-row">
                    <p className="font-semibold">{pub?.profile?.name}</p>
                      <p className="ml-2 mt-1 font-medium text-red-600 text-xs">{pub?.createdAt.substring(0, 10)}</p>
                    </div>
                    <p className="text-cyan-400 mr-2">{pub?.metadata?.name}</p>
                  </div>
                </div>
                <p className="text-base font-semibold ml-[62px] overflow-hidden mb-6">{pub?.metadata?.content}</p>

                {pub?.metadata?.media?.map((e: any) => {
                  if(e.original.mimeType == "video/mp4" || e.original.mimeType == "video/quicktime"){
                    if(e.original.url.startsWith('ipfs://')) {
                      let result = e?.original?.url?.substring(7, e.original.url.length)
                      let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                      return (
                        <div key={url} className="ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover w-[900px] h-[500px] object-contain" >
                          <source src={url} type="video/mp4"/>
                        </video> 
                        </div>
                      )
                    } else {
                      let url = e?.original?.url
                      return (
                        <div key={url} className="ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover w-[900px] h-[500px] object-contain" >
                          <source src={url} type="video/mp4"/>
                        </video>
                        </div>
                      )
                    }
                  } else if (e.original.mimeType == "image/png" || e.original.mimeType == "image/jpeg" || e.original.mimeType == "image/gif") {
                    if(e.original.url.startsWith('ipfs://')) {
                      let result = e?.original?.url?.substring(7, e.original.url.length)
                      let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                      return (
                        <div key={url} className="ml-[62px]">
                        <Image width="600" height="600" alt="" src={url || "/profile.png"} className="max-w-[700px] max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4"/>
                        </div>
                        
                      )
                    } else {
                      let url = e?.original?.url
                      return (
                        <div key={url} className="ml-[62px] ">
                        <Image width="600" height="600" alt="" src={url || "/profile.png"} className="w-[700px] max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4"/>
                        </div>
                      )
                    }
                  }
                }
                )}
                <div className="ml-[62px] flex flex-row justify-around w-2/3">
                  <p className="flex pt-2 text-base justify-between w-12"><Image className="w-6" src="/comments.png" alt="me" width="20" height="20" />{pub.stats?.totalAmountOfComments}</p>
                  <p className="flex pt-2 text-base justify-between w-12"><Image className="w-6" src="/retweet-.png" alt="me" width="20" height="20" />{pub.stats?.totalAmountOfMirrors}</p>
                  <p className="flex pt-2 text-base justify-between w-12"><Image className="w-6" src="/collection.png" alt="me" width="20" height="20" />{pub.stats?.totalAmountOfCollects}</p>
                </div>
              </div>
              </>
            ))
        }
      </div>
    </div>
  </>
  )
}