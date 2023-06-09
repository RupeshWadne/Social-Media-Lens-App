
'use client'
import LoadingScreen from "./LoadingScreen"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { client, exploreProfiles, explorePublications } from '../api'
import Link from 'next/link'


export default function Home() {
  /* create initial state to hold array of profiles */
  const [profiles, setProfiles] = useState<any>([])
  const [publications, setPublications] = useState<any>([])
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the duration as per your preference

    fetchProfiles()
    fetchPublication()
    return () => clearTimeout(timer);
  }, [])

  async function fetchPublication(){
    try {
      /* fetch profiles from Lens API */
      let response = await client.query({ query: explorePublications })
      /* loop over profiles, create properly formatted ipfs image links */
      let publicationData = await Promise.all(response.data.explorePublications.items.map(async (publicationInfo: any) => {
        let publication = { ...publicationInfo }
        let picture = publication.profile?.picture
        if (picture && picture.original && picture.original.url) {
          if (picture.original.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            publication.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
          } else {
            publication.avatarUrl = picture.original.url
          }
        }
        return publication
      }))

      /* update the local state with the profiles array */
      console.log(publicationData)
      setPublications(publicationData)
      // console.log(profileData)
    } catch (err) {
      console.log({ err })
    }
  }

  async function fetchProfiles() {
    try {
      /* fetch profiles from Lens API */
      let response = await client.query({ query: exploreProfiles })
      /* loop over profiles, create properly formatted ipfs image links */
      let profileData = await Promise.all(response.data.exploreProfiles.items.map(async (profileInfo: any) => {
        let profile = { ...profileInfo }
        let picture = profile?.picture
        if (picture.__typename === 'MediaSet') {
          if (picture?.original?.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
          } else {
            profile.avatarUrl = picture?.original?.url
          }
        }
        return profile
      }))

      /* update the local state with the profiles array */
      setProfiles(profileData)
      // console.log(profileData)
    } catch (err) {
      console.log({ err })
    }
  }

  if (isLoading) return <LoadingScreen/>

  return (

    <>
      <div className="flex justify-between bg-gradient-to-r from-zinc-300 to-gray-400 font-Anek">
        <div className="fixed top-0 bottom-0 w-96 overflow-y-scroll scrollbar scrollbar-thumb-gray-700 scrollbar-thin border-r-2 border-green-500">
          <div className="flex items-center justify-center h-20 w-full shadow-md bg-zinc-300 border-b-2 border-black sticky top-0 z-10">
            <h1 className='text-3xl mb-3 text-center font-bold ml-3'>Most Popular🦝</h1>
          </div>
          <div className="flex flex-col w-60 ml-4">
            <ul className="flex flex-col py-4">
              <li>
                {
                  profiles.map((profile: any) => (
                    <div key={profile.id} className='bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 w-[22rem] p-2 rounded-lg mb-8 flex flex-col items-center border-2 border-green-500 shadow-[5px_5px_0px_1px_rgba(40,28,120)]'>
                      <div className="flex w-full overflow-hidden">
                        <Image width="400" height="400" alt="" className='w-12 h-12 rounded-full' src={profile?.avatarUrl || '/profile.png'} />
                        <p className='text-base text-white font-bold mt-3 ml-2'>{profile?.name}</p>
                      </div>
                      <div className="flex w-full flex-row justify-between overflow-hidden">
                        <Link href={`/profile/${profile?.handle}`}>
                          <p className='cursor-pointer text-green-600 text-lg flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 hover:text-green-200'>{profile?.handle}</p>
                        </Link>
                        <p className='text-green-400 text-sm font-medium text-center'>{profile?.stats.totalFollowers} followers</p>
                      </div>
                      <div className="flex flex-row justify-around text-white w-full mb-2">
                        <p className="flex pt-2 text-sm justify-between w-fit "><Image className="w-4 mr-1 mt-1 h-4" src="/comments.png" alt="me" width="15" height="15" />{profile.stats?.totalComments}</p>
                        <p className="flex pt-2 text-sm justify-between w-fit "><Image className="w-4 mr-1 mt-1 h-4" src="/retweet-.png" alt="me" width="15" height="15" />{profile.stats?.totalMirrors}</p>
                        <p className="flex pt-2 text-sm justify-between w-fit "><Image className="w-4 mr-1 mt-1 h-4" src="/plus.png" alt="me" width="15" height="15" />{profile.stats?.totalPosts}</p>
                      </div>
                    </div>
                  ))
                }
              </li>
            </ul>
          </div>
        </div>

        {/* Explore LENS FEED */}
        <div className='flex flex-wrap h-fit w-fit flex-col mt-6 ml-[20rem] justify-center items-center'>
          <div className="w-full h-full">
            <h1 className='w-full text-3xl mb-3 font-bold text-center sticky'>Explore Lens 🌿</h1>
          </div>
        {
            publications?.map((pub: any) => (
              <>
              
              <div key={pub.id} className='p-8 rounded mb-8 w-[70%] shadow-[5px_5px_0px_0px_green] border-2 border-green-600 bg-gradient-to-r from-violet-300 to-violet-400'>
              <Link href={`/profile/${pub?.profile?.handle}`}>
                <div className="mb-5 flex flex-row">
                <Image width="400" height="400"
                  src={pub?.avatarUrl || "/profile.png"}
                  className="w-12 h-12 object-cover rounded-full shadow-lg border border-zinc-900"
                  alt="profile" />
                  <div className="ml-3">
                    <div className="flex flex-row">
                    <p className="font-bold">{pub?.profile?.name}</p>
                      <p className="ml-2 mt-1 font-medium text-red-600 text-xs">{pub?.createdAt?.substring(0, 10)}</p>
                    </div>
                    <p className="text-green-700 font-semibold underline mr-2">@{pub?.profile?.handle}</p>
                  </div>
                </div>
              </Link>
                <p className="text-base font-semibold ml-[62px] overflow-hidden mb-6">{pub?.metadata?.content}</p>

                {pub?.metadata?.media?.map((e: any) => {
                  if(e.original.mimeType == "video/mp4" || e.original.mimeType == "video/quicktime"){
                    if(e.original.url.startsWith('ipfs://')) {
                      let result = e.original.url.substring(7, e.original.url.length)
                      let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                      return (
                        <div key={url} className="ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover w-[900px] h-[500px] object-contain" >
                          <source src={url} type="video/mp4"/>
                        </video> 
                        </div>
                      )
                    } else {
                      let url = e.original.url
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
                      let result = e.original.url.substring(7, e.original.url.length)
                      let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                      return (
                        <div key={url} className="ml-[62px] w-fit">
                        <Image width="400" height="400" alt="" src={url} className="max-w-[700px] max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4"/>
                        </div>
                        
                      )
                    } else {
                      let url = e.original.url
                      return (
                        <div key={url} className="ml-[62px] w-fit">
                        <Image width="400" height="400" alt="" src={url} className="w-full max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4"/>
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