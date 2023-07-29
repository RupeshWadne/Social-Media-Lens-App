'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useExplorePublications } from '@lens-protocol/react-web'
import { motion } from "framer-motion"
import LoadingScreen from "../LoadingScreen"


const Feed = () => {
  let { data: publications, loading } = useExplorePublications({
    limit: 50,
  })

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
  publications = publications?.map(publication => {
    if (publication?.__typename === 'Mirror') {
      return publication?.mirrorOf
    } else {
      return publication
    }
  })

  if (loading) return <LoadingScreen />

  return (
    <motion.div 
    variants={container}
    initial="hidden"
    animate="visible" 
    className='flex h-fit w-screen lg:w-fit flex-col justify-center items-center bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500'>
      <div className="w-full h-full">
        <h1 className='w-full z-20 text-3xl mb-3 font-bold text-center sticky'>Explore Lens 🌿</h1>
      </div>
      {
        publications?.map((pub: any) => (
          <>

            <motion.div
                  variants={item}
                   key={pub?.id} className='p-8 rounded mb-8 w-[70%] shadow-[5px_5px_0px_0px_green] border-2 border-green-600 bg-gradient-to-r from-violet-300 to-violet-400'>
              <Link href={`/profile/${pub?.profile?.handle}`}>
                <motion.div whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: .2
                    }
                    
                  }} className="mb-5 flex flex-row bg-gradient-to-r from-violet-300 to-violet-400 p-2 rounded-l-xl w-11/12 hover:border-l-2 hover:border-green-600">
                  <Image width="400" height="400"
                    src={pub?.profile?.picture?.original?.url || "/profile.png"}
                    className="w-12 h-12 object-cover rounded-full shadow-lg border border-zinc-900"
                    alt="profile" />
                  <div className="ml-3">
                    <div className="flex flex-row">
                      <p className="font-bold">{pub?.profile?.name}</p>
                      <p className="ml-2 mt-1 font-medium text-red-600 text-xs">{pub?.createdAt?.substring(0, 10)}</p>
                    </div>
                    <p className="text-green-700 font-semibold underline mr-2">@{pub?.profile?.handle}</p>
                  </div>
                </motion.div>
              </Link>
              <p className="lg:text-base text-xs font-semibold lg:ml-[62px] overflow-hidden mb-6">{pub?.metadata?.content}</p>

              {pub?.metadata?.media?.map((e: any) => {
                if (e.original.mimeType == "video/mp4" || e.original.mimeType == "video/quicktime") {
                  if (e.original.url.startsWith('ipfs://')) {
                    let result = e.original.url.substring(7, e.original.url.length)
                    let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                    return (
                      <div key={url} className="lg:ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover lg:w-[900px] w-fit lg:h-[500px] h-fit object-contain" >
                          <source src={url} type="video/mp4" />
                        </video>
                      </div>
                    )
                  } else {
                    let url = e.original.url
                    return (
                      <div key={url} className="lg:ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover lg:w-[900px] w-fit lg:h-[500px] h-fit object-contain" >
                          <source src={url} type="video/mp4" />
                        </video>
                      </div>
                    )
                  }
                } else if (e.original.mimeType == "image/png" || e.original.mimeType == "image/jpeg" || e.original.mimeType == "image/gif") {
                  if (e.original.url.startsWith('ipfs://')) {
                    let result = e.original.url.substring(7, e.original.url.length)
                    let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                    return (
                      <div key={url} className="lg:ml-[62px] w-fit">
                        <Image width="400" height="400" alt="" src={url} className="max-w-[700px] max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4" />
                      </div>

                    )
                  } else {
                    let url = e.original.url
                    return (
                      <div key={url} className="lg:ml-[62px] w-fit">
                        <Image width="400" height="400" alt="" src={url} className="w-full min-w-[100px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4" />
                      </div>
                    )
                  }
                }
              }
              )}
              <div className="lg:ml-[62px] flex flex-row justify-around lg:w-2/3">
                <p className="flex pt-2 text-base justify-between w-12"><Image className="w-6" src="/comments.png" alt="me" width="20" height="20" />{pub.stats?.totalAmountOfComments}</p>
                <p className="flex pt-2 text-base justify-between w-12"><Image className="w-6" src="/retweet-.png" alt="me" width="20" height="20" />{pub.stats?.totalAmountOfMirrors}</p>
                <p className="flex pt-2 text-base justify-between w-12"><Image className="w-6" src="/collection.png" alt="me" width="20" height="20" />{pub.stats?.totalAmountOfCollects}</p>
              </div>
            </motion.div>
          </>
        ))
      }
    </motion.div>
  )
}

export default Feed
