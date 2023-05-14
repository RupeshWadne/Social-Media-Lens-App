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
      ""
    ],
  },
}

module.exports = nextConfig