import React from 'react'
import MovieCard from './MovieCard'
import { nanoid } from 'nanoid'

export default function Watchlist(props) {
  // ***** MOVIE CARDS MAPPED FROM MYWATCHLIST PROP *****
  const movieCards =
    //CHECK IF THERE ARE MOVIES IN MY WATCHLIST
    props.myWatchlist.length > 0 ? (
      props.myWatchlist.map((movie) => {
        return (
          <MovieCard
            key={nanoid()}
            cardId={movie.cardId}
            poster={movie.poster}
            title={movie.title}
            rating={movie.rating}
            date={movie.date}
            genre={movie.genre}
            plot={movie.plot}
            darkMode={props.darkMode}
            watchlist={true}
            removeFromWatchlist={props.removeFromWatchlist}
            reorderUp={props.reorderUp}
            reorderDown={props.reorderDown}
          />
        )
      })
    ) : (
      // IF NO MOVIES IN WATCHLIST RENDER THIS ELEMENT
      <div className="empty-watchlist-div">
        <h3>Your watchlist is looking a little empty...</h3>
        <div className="empty-add-div" onClick={props.toggleWatchlist}>
          <i className="fa-solid fa-circle-plus"></i>
          <h5>Let's add some movies!</h5>
        </div>
      </div>
    )

  return <div id="page-container">{movieCards}</div>
}
