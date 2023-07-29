'use client'
import LoadingScreen from "../LoadingScreen"
import Image from 'next/image'
import Link from 'next/link'
import { useExploreProfiles } from '@lens-protocol/react-web'
import { motion } from "framer-motion"


export default function Profile() {
  /* create initial state to hold array of profiles */
  const { data: profiles, loading } = useExploreProfiles({
    limit: 50
  })
  console.log(profiles)

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) return <LoadingScreen />

  return (

    <>
      <div className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 font-Anek">
        <h1 className='text-3xl mb-3 text-center font-bold ml-3'>Most Popular🦝</h1>
        <div className="border-black">
          <motion.div
            className="mx-auto mt-8 grid grid-flow-row lg:w-fit w-screen md:grid-cols-2  lg:grid-cols-3 lg:grid-rows-4 gap-x-20"
            variants={container}
            initial="hidden"
            animate="visible"
          >

            {
              profiles?.map((profile: any) => (
                <motion.div
                  key={profile.id}
                  variants={item}
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: .2
                    }
                  }} className='bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 w-[22rem] p-2 rounded-lg mb-8 flex flex-col items-center border-2 border-green-500 shadow-[5px_5px_0px_1px_rgba(40,28,120)]'>
                  <div className="flex flex-col h-40 w-full overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover absolute"
                      src={profile?.coverPicture?.original?.url || "/Lens.jpeg"}
                      alt="Cover Picture"
                    />
                    <motion.div
                      className="mx-auto z-10"
                    >
                      <Image width="80" height="80" objectFit="cover" loading="lazy" alt="" className='rounded-full z-10 w-20 h-20 border-2 border-white mt-6' src={profile?.picture?.original?.url || '/profile.png'} />
                    </motion.div>
                    <p className='text-base text-center z-10 text-black bg-white w-auto font-bold mt-2'>{profile?.name}</p>
                  </div>
                  <div className="flex w-full flex-row justify-between overflow-hidden">
                    <Link href={`/profile/${profile?.handle}`}>
                      <p className='cursor-pointer text-emerald-600 font-bold text-lg flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 hover:text-green-600'>@{profile?.handle}</p>
                    </Link>
                    <p className='text-emerald-600 m-4 text-sm font-medium text-center'>{profile?.stats.totalFollowers} followers</p>
                  </div>
                  <div className="flex flex-row justify-around text-black font-semibold w-full mb-2">
                    <p className="flex pt-2 text-sm justify-between w-fit "><Image className="w-4 mr-1 mt-1 h-4" src="/comments.png" alt="me" width="15" height="15" />{profile.stats?.totalComments}</p>
                    <p className="flex pt-2 text-sm justify-between w-fit "><Image className="w-4 mr-1 mt-1 h-4" src="/retweet-.png" alt="me" width="15" height="15" />{profile.stats?.totalMirrors}</p>
                    <p className="flex pt-2 text-sm justify-between w-fit "><Image className="w-4 mr-1 mt-1 h-4" src="/plus.png" alt="me" width="15" height="15" />{profile.stats?.totalPosts}</p>
                  </div>
                </motion.div>
              ))
            }
          </motion.div>
        </div>
      </div>
    </>
  )
}