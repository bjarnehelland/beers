import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { firstBy } from 'thenby'
import Beer from '../components/beer'
import useMultiFilter from '../components/useMultiFilter'
import useInteractions from './../components/useInteractions'

const Index = props => {
  const [beers, Filters] = useMultiFilter(props.beers, [
    { prop: 'session' },
    { prop: 'filterStyle' },
    { prop: 'room' },
  ])

  const {
    likes,
    interested,
    handleToggleLike,
    handleToggleInterested,
  } = useInteractions()

  return (
    <div>
      <Head>
        <title>Whats brewing?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Filters />

      <div>
        {beers.map((beer, i) => (
          <Beer
            key={beer.name + beer.session}
            beer={beer}
            liked={!!likes[beer.name]}
            interested={!!interested[beer.name]}
            toggleLike={() => handleToggleLike(beer.name)}
            toggleInterested={() => handleToggleInterested(beer.name)}
          />
        ))}
      </div>
      <style jsx global>{`
        html {
          box-sizing: border-box;
        }
        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        body {
          padding: 0;
          margin: 0;
        }

        :root {
          --filter-color: #000;
          --filter-check-color: var(--filter-color);
          --filter-check-background: #78b18f;
        }
      `}</style>
    </div>
  )
}

function getSession(untappdSectionId) {
  switch (untappdSectionId) {
    case '440439':
      return 'Fredag (14-18)'
    case '440440':
      return 'Fredag (18-22)'
    case '440449':
      return 'Lørdag (14-18)'
    case '440450':
      return 'Lørdag (18-22)'
  }
}

Index.getInitialProps = async () => {
  const res = await fetch(
    'https://www.whatsbrewing.no/wp-content/themes/wb2019/untappd/http/beers.json',
  )
  const json = await res.json()
  const beers = json.map(b => ({
    ...b,
    session: getSession(b.untappdSectionId),
    untappdRating: b.untappdRating > 0 ? b.untappdRating : null,
    filterStyle: b.filterStyle[0],
  }))

  beers.sort(firstBy('room').thenBy('breweryName'))

  return { beers }
}

export default Index
