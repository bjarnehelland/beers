import React from 'react'

export default function useInteractions() {
  const [likes, setLikes] = React.useState({})
  const [interested, setInterested] = React.useState({})

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

  const handleToggle = fn => name =>
    fn(fn => ({ ...fn, [name]: fn[name] ? false : true }))

  return {
    likes,
    interested,
    handleToggleLike: handleToggle(setLikes),
    handleToggleInterested: handleToggle(setInterested),
  }
}
