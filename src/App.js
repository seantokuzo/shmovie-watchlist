import React, { useEffect, useState } from 'react'
import Header from './components/Header.js'
import SearchPage from './components/SearchPage.js'
import Watchlist from './components/Watchlist.js'
import logoDay from './img/seantokuzo-logo.png'
import logoNight from './img/seantokuzo-logo-purp.png'
import './index.css'

function App() {
  const tmdbKey = '3259933c93801a8673fb6333e45681c4'
  const [alert, setAlert] = useState(false)
  const [addedAlert, setAddedAlert] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [myWatchlist, setMyWatchlist] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  // ***** CHANGE BODY COLOR ON DARKMODE CHANGE *****
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = 'var(--bg-dark)'
    } else document.body.style.backgroundColor = 'var(--bg-light)'
  }, [darkMode])

  // ***** TOGGLE DARKMODE *****
  function toggleDarkMode() {
    setDarkMode((prevDarkMode) => !prevDarkMode)
  }

  // ***** TOGGLE WATCHLIST / SEARCH PAGE *****
  function toggleWatchlist() {
    setShowWatchlist((prevState) => !prevState)
  }

  // ***** GET WATCHLIST FROM LOCAL STORAGE *****
  useEffect(() => {
    if (localStorage.getItem('myWatchlist')) {
      setMyWatchlist(JSON.parse(localStorage.getItem('myWatchlist')))
    } else return
  }, [])

  // ***** GET DARKMODE FROM LOCAL STORAGE *****
  useEffect(() => {
    if (localStorage.getItem('darkMode')) {
      setDarkMode(JSON.parse(localStorage.getItem('darkMode')))
    } else return
  }, [])

  // ***** GET SHOWWATCHLIST FROM LOCAL STORAGE *****
  useEffect(() => {
    if (localStorage.getItem('showWatchlist')) {
      setShowWatchlist(JSON.parse(localStorage.getItem('showWatchlist')))
    } else return
  }, [])

  // ***** UPDATE WATCHLIST/DARKMODE/SHOWWATCHLIST IN LOCAL STORAGE ANYTIME IT CHANGES *****
  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist))
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    localStorage.setItem('showWatchlist', JSON.stringify(showWatchlist))
  }, [myWatchlist, darkMode, showWatchlist])

  // ***** SEARCH HANDLER - FETCH DATA *****
  function handleSearch(e) {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${e.target.value}&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          setNoResults(false)
        } else if (data.total_results === 0) {
          setNoResults(true)
          setSearchResults([])
        } else if (data.results.length > 0) {
          setSearchResults(
            data.results.map((movie) => ({
              id: movie.id,
              poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
              title: movie.title,
              rating: movie.vote_average,
              date: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
              genre: movie.genre_ids,
              plot: movie.overview,
            }))
          )
          setNoResults(false)
        }
      })
      .catch((err) => console.log(err))
  }

  // ***** ADD MOVIE TO WATCHLIST HANDLER *****
  function addToWatchlist(poster, title, rating, date, genre, plot, cardId) {
    if (!myWatchlist.every((movie) => movie.cardId !== cardId)) {
      setAlert(true)
      setTimeout(() => {
        setAlert(false)
      }, 1900)
      return
    }
    setMyWatchlist((prevWatchlist) => [
      ...prevWatchlist,
      {
        poster,
        title,
        rating,
        date,
        genre,
        plot,
        cardId,
      },
    ])
    setAddedAlert(true)
    setTimeout(() => {
      setAddedAlert(false)
    }, 1900)
  }

  // ***** REMOVE MOVIE FROM WATCHLIST HANDLER *****
  function removeFromWatchlist(poster) {
    setMyWatchlist((prevWatchlist) => {
      return prevWatchlist.filter((movie) => movie.poster !== poster)
    })
  }

  // ***** REORDERING WATCHLIST HANDLERS - MOVE UP *****
  function reorderUp(id) {
    const currentMovie = myWatchlist.filter((movie) => movie.cardId === id)
    const currentMovieIndex = myWatchlist.indexOf(...currentMovie)
    if (currentMovieIndex === 0) return

    setMyWatchlist((prevWatchlist) => [
      ...prevWatchlist.slice(0, currentMovieIndex - 1),
      ...currentMovie,
      ...prevWatchlist.slice(currentMovieIndex - 1, currentMovieIndex),
      ...prevWatchlist.slice(currentMovieIndex + 1),
    ])
  }

  // ***** REORDERING WATCHLIST HANDLERS - MOVE DOWN *****
  function reorderDown(id) {
    const currentMovie = myWatchlist.filter((movie) => movie.cardId === id)
    const currentMovieIndex = myWatchlist.indexOf(...currentMovie)
    if (currentMovieIndex === myWatchlist.length - 1) return

    setMyWatchlist((prevWatchlist) => [
      ...prevWatchlist.slice(0, currentMovieIndex),
      ...prevWatchlist.slice(currentMovieIndex + 1, currentMovieIndex + 2),
      ...currentMovie,
      ...prevWatchlist.slice(currentMovieIndex + 2),
    ])
  }

  // ***** BACKGROUND COLOR - CONDITIONAL ON DARKMODE *****
  const bgStyle = {
    backgroundColor: darkMode ? 'var(--bg-dark)' : 'var(--bg-light)',
    color: darkMode ? 'var(--text-dm)' : 'var(--text-lm)',
  }

  // ***** DUPLICATE MOVIE ALERT STYLE *****
  const popupStyle = {
    backgroundColor: darkMode ? 'var(--plot-lm)' : 'var(--plot-dm)',
  }

  const footieStyle = {
    color: darkMode ? 'var(--plot-dm)' : 'var(--plot-lm)',
    backgroundColor: darkMode ? 'var(--bg-dark)' : 'var(--bg-light)',
  }

  const logoImg = darkMode ? logoNight : logoDay

  // ***** DARKMODE TOGGLER ELEMENT *****
  const togglerEl = (
    <div className="toggler-div">
      <label className="switch">
        <input id="toggler" type="checkbox" onChange={toggleDarkMode} />
        <span className="slider round"></span>
      </label>
    </div>
  )

  // ***** MOVIE ADDED ALERT *****
  const movieAddedAlertEl = (
    <h5 className="popup fade-out" style={popupStyle}>
      Movie added to watchlist
    </h5>
  )

  // ***** DUPLICATE MOVIE ALERT *****
  const duplicateMovieAlertEl = (
    <h5 className="popup fade-out" style={popupStyle}>
      Move already on watchlist!
    </h5>
  )

  // ***** FOOTER ELEMENT *****
  const footerEl = (
    <footer style={footieStyle}>
      <div>
        <a
          href="https://seantokuzo.dev"
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <img src={logoImg} alt="logo" />
          <h6 style={footieStyle}>
            A <span style={{ fontWeight: 'bolder' }}>{'<seantokuzo>'}</span> app
          </h6>
        </a>
      </div>
      <div>
        <h6 style={footieStyle}>Powered by</h6>
        <img
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
          alt="The movie database api logo"
        />
      </div>
    </footer>
  )

  return (
    <div style={bgStyle}>
      {togglerEl}
      <Header
        showWatchlist={showWatchlist}
        toggleWatchlist={toggleWatchlist}
        toggleDarkMode={toggleDarkMode}
      />
      {showWatchlist ? (
        <Watchlist
          myWatchlist={myWatchlist}
          darkMode={darkMode}
          removeFromWatchlist={removeFromWatchlist}
          toggleWatchlist={toggleWatchlist}
          reorderUp={reorderUp}
          reorderDown={reorderDown}
        />
      ) : (
        <SearchPage
          darkMode={darkMode}
          addToWatchlist={addToWatchlist}
          showWatchlist={showWatchlist}
          searchResults={searchResults}
          handleSearch={handleSearch}
          noResults={noResults}
        />
      )}
      {alert && duplicateMovieAlertEl}
      {addedAlert && movieAddedAlertEl}
      {footerEl}
    </div>
  )
}

export default App
