import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

/* create the API client */
export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

/* define a GraphQL query  */
export const exploreProfiles = gql`
query ExploreProfiles {
  exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS, limit: 50 }) {
    items {
      id
      name
      bio
      handle
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      stats {
        totalFollowers
        totalPosts
        totalComments
        totalMirrors
      }
    }
  }
}
`

export const getProfile = gql`
query Profile($handle: Handle!) {
  profile(request: { handle: $handle }) {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    followNftAddress
    metadata
    isDefault
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
      __typename
    }
    handle
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
      __typename
    }
    ownedBy
    dispatcher {
      address
      canUseRelay
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            symbol
            name
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
        type
      }
      ... on RevertFollowModuleSettings {
        type
      }
    }
  }
}
`

export const getPublications = gql`
  query Publications($id: ProfileId!) {
    publications(request: {
      profileId: $id,
      publicationTypes: [POST],
      limit: 50
    }) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
      }
    }
  }
  fragment ProfileFields on Profile {
    id
    name
    bio
    picture {
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
  }
  
  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment PostFields on Post {
    id
    createdAt
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }
  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
  }
`

export const explorePublications = gql`
query ExplorePublications {
  explorePublications(request: {
    sortCriteria: TOP_COMMENTED,
    publicationTypes: [POST, COMMENT, MIRROR],
    limit: 50
  }) {
    items {
      __typename 
      ... on Post {
        ...PostFields
      }
    }
  }
}

fragment ProfileFields on Profile {
  id
  name
  bio
  handle
  picture {
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
}

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
}


fragment MediaFields on Media {
  url
  width
  height
  mimeType
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
  }
}

fragment PostFields on Post {
  id
  createdAt
  metadata {
    ...MetadataOutputFields
  }
  stats {
    ...PublicationStatsFields
  }
  profile {
    ...ProfileFields
  }
}
`