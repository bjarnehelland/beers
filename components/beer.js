import React from 'react'
import Like from './like'
import Interested from './interested'

const Beer = ({ beer, toggleLike, liked, toggleInterested, interested }) => (
  <div className="beer">
    <div className="like" onClick={toggleLike}>
      <Like liked={liked} />
    </div>
    <div className="name" title={beer.description} onClick={toggleLike}>
      {beer.name} ({beer.abv}%)
    </div>
    <div className="style" onClick={toggleLike}>
      {beer.style}
    </div>
    <div className="brewery" onClick={toggleInterested}>
      {beer.breweryName}
    </div>
    <div className="country">{beer.country}</div>
    <div className="room" onClick={toggleInterested}>
      {beer.room}
    </div>
    <div className="rating">{beer.untappdRating}</div>
    <div className="interested" onClick={toggleInterested}>
      <Interested interested={interested} />
    </div>
    <style jsx>{`
      .beer {
        display: grid;
        grid-template-columns: 15px 1fr 202px 185px 100px 100px 42px 15px;
        border-bottom: 1px solid #afafaf;
        padding: 0 10px;
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
        .beer > div.brewery {
          grid-column: 3;
          grid-row: 1;
          align-items: flex-start;
          max-width: 180px;
          text-align: end;
        }

        .beer > div.room {
          justify-content: flex-end;
          align-items: flex-start;
        }

        .beer > div.rating,
        .beer > div.country {
          display: none;
        }
      }
    `}</style>
  </div>
)

export default Beer
