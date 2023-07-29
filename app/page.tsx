'use client'
import Link from "next/link";
import { motion } from 'framer-motion';
export default function Home() {

  return (
    <>
      {/* Creating a hero component with black background and centering everything in the screen */}
      <section className="relative flex flex-col h-screen justify-center items-center">
        <img src="/Lens.jpg" className="absolute top-0 w-full h-[100vh] object-cover" alt="" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="text-center pb-12 md:pb-16">
              <h1
                className="text-5xl bg-black p-2 text-green-700 shadow-[5px_5px_0px_1px_rgba(40,28,120)] border border-black md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                data-aos="zoom-y-out"
              >
                It is Social Media, but{' '}
                <motion.span initial="hidden" animate="visible" variants={{
                hidden: {
                  scale: .8,
                  opacity: 0
                },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: 1
                  }
                },
              }} className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  Decentralized
                </motion.span>
              </h1>
              <div className="max-w-3xl flex justify-around mx-auto">
                <Link href="/explore-feed">
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.2 }}
                    className="items-center bg-white rounded-full font-medium  p-4 w-32 border-2 border-green-500 shadow-[5px_5px_0px_1px_rgba(40,28,120)]"
                  >

                    <span>Posts</span>
                  </motion.button>
                </Link>
                <Link href="/explore-profile">
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.2 }}
                    className="items-center bg-white rounded-full font-medium  p-4 w-32 border-2 border-green-500 shadow-[5px_5px_0px_1px_rgba(40,28,120)]"
                  >

                    <span>People</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}