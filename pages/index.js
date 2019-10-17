import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { firstBy } from 'thenby'
import Beer from '../components/beer'
import useFilter from '../components/useFilter'
import useMultiFilter from '../components/useMultiFilter'
import useInteractions from './../components/useInteractions'

const Index = props => {
  const [session, FilterSession] = useFilter(props.sessions)
  const [styles, FilterStyles] = useMultiFilter(props.styles)
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

      <div>
        <FilterSession title="Økt" />
        <FilterStyles title="Stil" />
      </div>

      <div>
        {props.beers
          .filter(b => b.session === session)
          .filter(b => styles.includes(b.filterStyle))
          .map(beer => (
            <Beer
              key={beer.name}
              beer={beer}
              liked={!!likes[beer.name]}
              interested={!!interested[beer.name]}
              toggleLike={() => handleToggleLike(beer.name)}
              toggleInterested={() => handleToggleInterested(beer.name)}
            />
          ))}
      </div>
    </div>
  )
}

Index.getInitialProps = async () => {
  const sessions = [
    'Fredag (14-18)',
    'Fredag (18-22)',
    'Lørdag (14-18)',
    'Lørdag (18-22)',
  ]

  function getSession(untappdSectionId) {
    switch (untappdSectionId) {
      case '440439':
        return sessions[0]
      case '440440':
        return sessions[1]
      case '440449':
        return sessions[2]
      case '440450':
        return sessions[3]
    }
  }

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

  const styles = [...new Set(beers.map(b => b.filterStyle))]

  return { beers, styles, sessions }
}

export default Index
