'use client'
import { motion } from "framer-motion";
import LoadingScreen from "../../LoadingScreen"
import {
  useProfile,
  usePublications,
  useFollow,
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
  Profile,
  ProfileOwnedByMe
} from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Profile() {
  const { execute: login } = useWalletLogin();
  const { execute: logout } = useWalletLogout();
  const { data: wallet } = useActiveProfile();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const pathName = usePathname()
  const handle = pathName?.split('/')[2]
  let { data: profile, loading } = useProfile({ handle })
  console.log(profile)

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    const { connector } = await connectAsync();
    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      await login({
        address: walletClient.account.address,
      });
    }
  };

  if('original' in profile?.coverPicture){
    var originalValue = profile?.coverPicture?.original;
  } else{
    <Image width="600" height="600" alt="cover" src="/Lens.jpg"/>
  }
  if (loading) return <LoadingScreen />

  return (
    <motion.div className='bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500'>

      <section className="mb-32">
        <div className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
          
          <Image width="600" height="600" src={originalValue?.url || "/Lens.jpeg"} alt="Cover Image" className="w-full h-[500px] hidden lg:flex object-cover absolute border-b-2 border-violet-700" />
          
          <div className="hidden lg:flex flex-wrap items-center">
            <div className="hidden lg:flex mt-64 grow-0 relative shrink-0 basis-auto lg:w-9/12 xl:w-4/12">
              <Image width="600" height="600" src={profile?.picture?.original?.url || "/profile-icon.png"} alt="Profile" className="lg:w-9/12 lg:h-96 object-cover lg:ml-10 lg:rounded-full border-2 border-green-500" />
            </div>
            <div className="grow-0 relative shrink-0 basis-auto lg:w-6/12 xl:w-8/12">
              <div className="px-6 py-12 mt-80 md:px-12 w-9/12 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl border-2 border-green-500 shadow-[5px_5px_0px_1px_rgba(40,28,120)]">
                <div className="relative">
                  <div>
                    <h2 className="text-2xl text-white font-bold mb-2">{profile?.name}</h2>
                    <h2 className="text-green-700 font-semibold underline mr-2 mb-2">@{profile?.handle}</h2>
                    <p className="uppercase text-slate-100 font-bold mb-6 flex items-center underline decoration-red-600">
                      {profile?.bio}
                    </p>
                  </div>
                  <div className="absolute right-0 top-0">
                    {!wallet && (
                      <button
                        className="bg-white font-bold shadow-[5px_5px_0px_1px_rgba(0,0,0)] text-black px-8 py-2 rounded-full mb-4"
                        onClick={onLoginClick}
                      >
                        Sign In
                      </button>
                    )}
                    {wallet && profile && (
                      <>
                        <FollowComponent
                          isConnected={isConnected}
                          profile={profile}
                          wallet={wallet}
                        />
                        <button
                          className="bg-white font-bold shadow-[5px_5px_0px_1px_rgba(0,0,0)] text-black px-8 py-2 rounded-full mb-4"
                          onClick={logout}
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex text-zinc-300 justify-between w-6/12">
                  <p className="mb-6">
                    Followers: <span className="font-semibold">{profile?.stats?.totalFollowers}</span>
                  </p>
                  <p className="mb-6 ml-6">
                    Following: <span className="font-semibold">{profile?.stats?.totalFollowing}</span>
                  </p>
                </div>
                <div className="flex justify-between text-zinc-300 overflow-hidden w-full flex-wrap h-full m-auto">


                  {profile?.__attributes?.map((e: any) => {
                    if (e.key == "location") {
                      return (
                        <p key={e.value} className="mb-6 pr-2">
                          Location:<span className="font-semibold">{e.value || "0"}</span></p>
                      )
                    } else if (e.key == "website") {
                      return (
                        <p key={e.value} className="mb-6 pr-2">
                          Website:<a className="font-semibold underline cursor-pointer" target="_blank" href={e.value}>{e.value || "0"}</a></p>
                      )
                    } else if (e.key == "twitter") {
                      return (
                        <p key={e.value} className="mb-6">
                          Twitter:<a className="font-semibold underline" href={`https://twitter.com/${e.value}`} target="_blank" >
                            {e.value || "0"}
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
        <div className='flex flex-col justify-center items-center'>
          {profile && <Publications profile={profile} />}
        </div>
    </motion.div>
  )
}

function FollowComponent({
  wallet,
  profile,
  isConnected,
}: {
  isConnected: boolean;
  profile: Profile;
  wallet: ProfileOwnedByMe;
}) {
  const { execute: follow, error } = useFollow({
    followee: profile,
    follower: wallet,
  });


  return (
    <>
      {isConnected && (
        <button
          className="bg-white text-black px-14 py-4 rounded-full"
          onClick={follow}
        >
          Follow {profile?.handle}
        </button>
      )}
    </>
  );
}

function Publications({
  profile
}: {
  profile: Profile
}) {
  let { data: publications, loading } = usePublications({
    profileId: profile.id,
    limit: 50,
  })

  publications = publications?.map(publication => {
    if (publication.__typename === 'Mirror') {
      return publication.mirrorOf
    } else {
      return publication
    }
  })

  console.log(publications)

  if (loading) return <p className="p-14">Loading ...</p>

  return (
    <>
      {
        publications?.map((pub: any) => (
          <>

            <motion.div key={pub?.id} className='shadow-[5px_5px_0px_0px_green] border-2 border-green-600 bg-gradient-to-r from-violet-300 to-violet-400 p-8 rounded mb-8 w-2/3'>
              <motion.div whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: .2
                    }
                  }}  className="mb-5 flex flex-row bg-gradient-to-r from-violet-300 to-violet-400 p-2 rounded-l-xl w-11/12 hover:border-l-2 hover:border-green-600">
                <Image width="600" height="600"
                  src={pub?.profile?.picture?.original?.url || "/profile.png"}
                  className="w-12 h-12 rounded-full shadow-lg border border-zinc-900"
                  alt="Avatar" />
                <div className="ml-3">
                  <div className="flex flex-row">
                    <p className="font-bold">{pub?.profile?.name}</p>
                    <p className="ml-2 mt-1 font-medium text-red-600 text-xs">{pub?.createdAt.substring(0, 10)}</p>
                  </div>
                  <p className="text-green-700 font-semibold underline mr-2">{pub?.metadata?.name}</p>
                </div>
              </motion.div>
              <p className="text-base font-semibold lg:ml-[62px] overflow-hidden mb-6">{pub?.metadata?.content}</p>

              {pub?.metadata?.media?.map((e: any) => {
                if (e.original.mimeType == "video/mp4" || e.original.mimeType == "video/quicktime") {
                  if (e.original.url.startsWith('ipfs://')) {
                    let result = e?.original?.url?.substring(7, e.original.url.length)
                    let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                    return (
                      <div key={url} className="lg:ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover w-[900px] h-[500px] object-contain" >
                          <source src={url} type="video/mp4" />
                        </video>
                      </div>
                    )
                  } else {
                    let url = e?.original?.url
                    return (
                      <div key={url} className="lg:ml-[62px]">
                        <video controls className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover w-[900px] h-[500px] object-contain" >
                          <source src={url} type="video/mp4" />
                        </video>
                      </div>
                    )
                  }
                } else if (e.original.mimeType == "image/png" || e.original.mimeType == "image/jpeg" || e.original.mimeType == "image/gif") {
                  if (e.original.url.startsWith('ipfs://')) {
                    let result = e?.original?.url?.substring(7, e.original.url.length)
                    let url = `http://lens.infura-ipfs.io/ipfs/${result}`
                    return (
                      <div key={url} className="lg:ml-[62px] w-fit grid grid-cols-1">
                        <Image width="600" height="600" alt="" src={url || "/profile.png"} className="max-w-[700px] max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4" />
                      </div>

                    )
                  } else {
                    let url = e?.original?.url
                    return (
                      <div key={url} className="lg:ml-[62px] w-fit">
                        <Image width="600" height="600" alt="" src={url || "/profile.png"} className="w-full max-h-[700px] object-contain shadow-lg rounded-lg relative overflow-hidden mb-4" />
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
    </>
  )
}