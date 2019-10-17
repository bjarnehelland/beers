import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { firstBy } from 'thenby'
import Beer from '../components/beer'
import Filter from './../components/filter'

const sessionList = [
  'Fredag (14-18)',
  'Fredag (18-22)',
  'Lørdag (14-18)',
  'Lørdag (18-22)',
]

function getSession(untappdSectionId) {
  switch (untappdSectionId) {
    case '440439':
      return sessionList[0]
    case '440440':
      return sessionList[1]
    case '440449':
      return sessionList[2]
    case '440450':
      return sessionList[3]
  }

  return untappdSectionId
}

const Index = props => {
  const [likes, setLikes] = React.useState({})
  const [interested, setInterested] = React.useState({})
  const [session, setSession] = React.useState(sessionList[0])
  const [style, setStyle] = React.useState('Alle')

  React.useEffect(() => {
    if (Object.keys(likes).length === 0) return
    window.localStorage.setItem('likes', JSON.stringify(likes))
  }, [likes])

  React.useEffect(() => {
    if (Object.keys(interested).length === 0) return
    window.localStorage.setItem('interested', JSON.stringify(interested))
  }, [interested])

  React.useEffect(() => {
    const likes = localStorage.getItem('likes')
    if (likes) setLikes(JSON.parse(likes))

    const interested = localStorage.getItem('interested')
    if (interested) setInterested(JSON.parse(interested))
  }, [])

  function handleToggleLike(name) {
    setLikes(likes => ({ ...likes, [name]: likes[name] ? false : true }))
  }

  function handleToggleInterested(name) {
    setInterested(interested => ({
      ...interested,
      [name]: interested[name] ? false : true,
    }))
  }

  return (
    <div>
      <Head>
        <title>Whats brewing?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        Økt:{' '}
        <Filter
          items={sessionList}
          selectedItem={session}
          onChange={setSession}
        />{' '}
        Stil:{' '}
        <Filter
          items={['Alle', ...new Set(props.beers.map(b => b.filterStyle))]}
          selectedItem={style}
          onChange={setStyle}
        />
      </div>

      <div>
        {props.beers
          .filter(b => b.session === session)
          .filter(b => style === 'Alle' || b.filterStyle === style)
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
