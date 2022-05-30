import React from 'react'
import { nanoid } from 'nanoid'
import MovieCard from './MovieCard.js'

export default function SearchPage(props) {
  // ***** DYNAMIC STYLES *****
  const searchFieldStyle = {
    border: props.darkMode ? 'none' : '1px solid var(--plot-lm)',
  }

  const changingColor = {
    color: props.darkMode ? 'var(--dark-grey)' : 'var(--light-grey)',
  }

  // ***** ON SEARCH RESULTS - MAP OUT MOVIE CARDS FROM DATA *****
  const searchMovieCards = props.searchResults.slice().map((movie) => {
    return (
      <MovieCard
        key={nanoid()}
        cardId={movie.id}
        poster={`${movie.poster}`}
        title={movie.title}
        rating={movie.rating}
        date={movie.date}
        genre={movie.genre}
        plot={movie.plot}
        darkMode={props.darkMode}
        addToWatchlist={props.addToWatchlist}
      />
    )
  })

  // ***** START EXPLORING / NO RESULTS DISPLAYS *****
  const startExploringEl = (
    <div className="start-exploring-div" style={changingColor}>
      <i className="fa-solid fa-film"></i>
      <h3>Start exploring</h3>
    </div>
  )

  const cantFindEl = (
    <div className="start-exploring-div" style={changingColor}>
      <h3>
        Unable to fund what you're looking for. Please try another search.
      </h3>
    </div>
  )

  // ***** FUNCTION TO FIGURE OUT WHICH ELEMENT TO DISPLAY *****
  function whoToRender() {
    if (props.noResults) {
      return cantFindEl
    } else if (searchMovieCards.length > 0) {
      return searchMovieCards
    } else return startExploringEl
  }

  return (
    <div className="page-container">
      <input
        onChange={props.handleSearch}
        type="text"
        placeholder="Search for a movie"
        results="0"
        maxLength={80}
        minLength={1}
        style={searchFieldStyle}
      ></input>
      {whoToRender()}
    </div>
  )
}
