import React from 'react'
import headerImg from '../img/header-bg-img.jpg'

function Header(props) {
  const headerTitle = props.showWatchlist ? 'My Watchlist' : 'Find your film'
  const headerNav = props.showWatchlist ? 'Search for movies' : 'My Watchlist'

  return (
    <header style={{ backgroundImage: `url(${headerImg})` }}>
      <h5 onClick={props.toggleWatchlist}>{headerNav}</h5>
      <h1>{headerTitle}</h1>
    </header>
  )
}

export default Header
