import React from 'react'
import Like from './like'
import Interested from './interested'

const Beer = ({ beer, toggleLike, liked, toggleInterested, interested }) => (
  <div className="beer">
    <div className="like" onClick={toggleLike}>
      <Like liked={liked} />
    </div>
    <div className="name" title={beer.description}>
      {beer.name} ({beer.abv}%)
    </div>
    <div className="style">{beer.style}</div>
    <div className="brewery">{beer.breweryName}</div>
    <div className="room">{beer.room}</div>
    <div className="rating">{beer.untappdRating}</div>
    <div className="interested" onClick={toggleInterested}>
      <Interested interested={interested} />
    </div>
    <style jsx>{`
      .beer {
        display: grid;
        grid-template-columns: 15px 1fr 260px 290px 100px 42px 15px;
        border-bottom: 1px solid #afafaf;
        page-break-inside: avoid;
      }
      .beer > div {
        display: flex;
        align-items: center;
        padding: 0 10px;
      }
      .beer > .rating {
        justify-content: flex-end;
      }

      .beer > .like,
      .beer > .interested {
        padding: 0;
      }

      @media only screen and (max-width: 1000px) {
        .beer {
          grid-template-columns: 15px 1fr auto 15px;
        }

        .beer > .like {
          grid-row-start: 1;
          grid-row-end: 3;
        }

        .beer > .interested {
          grid-row-start: 1;
          grid-row-end: 3;
          grid-column: 4;
        }

        .beer > div.style,
        .beer > div.room {
          justify-content: flex-end;
          align-items: flex-start;
        }

        .beer > div.rating {
          display: none;
        }
      }
    `}</style>
  </div>
)

export default Beer
