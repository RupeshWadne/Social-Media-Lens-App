/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'ipfs.infura.io',
      'statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com',
      'lens.infura-ipfs.io',
      'source.unsplash.com',
      'arweave.net',
      'images.lens.phaver.com',
      'nftstorage.link',
      'media4.giphy.com',
      'picsum.photos',
      'media1.giphy.com',
      'media2.giphy.com',
      'media0.giphy.com',
      'media3.giphy.com',
      'media.orb.ac',
      "ik.imagekit.io",
      "ipfs://QmQosmUhSHTWd6Quad8qKwGi5rihogb7rU4zeByFpfMRM2",
      "ipfs://bafybeielthjrpyieqjkkyxopiclgwwv2b5lljxhnk7edcr5brbz3cuu4fe",
      "ipfs://",
      "ipfs://bafkreibbsw6acdk7suqcke6wnyzc32ivs3ctllmcfcdoo35hduyuddvkru"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs',
        port: '',
        pathname: '/',
      },
    ],
  },
}

module.exports = nextConfig