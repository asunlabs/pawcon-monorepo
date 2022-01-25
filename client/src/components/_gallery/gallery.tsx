import * as React from 'react'
import { v4 as uuidV4 } from 'uuid'
import { GalleryCards } from './galleryCards'
import { GalleryCardContainerStyle, GalleryCardPaginationStyle } from '../containers/styleContainer'
import { ArtworkContext } from '../contexts/artworkContext'
import { ImgBanner } from '../subComponents/banner'
import { IMG_BANNER } from '../containers/imgContainer'

export function Gallery () {
  const [page, setPage] = React.useState(1)
  const artworks = React.useContext(ArtworkContext)
  
  return (
    <>
      <main style={{"display" : "flex", "flexFlow": "column nowrap", "justifyContent": "center", "alignItems":"center"}}>
        <h1>PawCon Gallery</h1>

        ======== slider here ========
        <ImgBanner img={IMG_BANNER.saluteDev} shouldBeGrid={false}/>
        ======== slider here ========
        
        <h2>Weekly Tops</h2>
        <span>Meet coolest paw-oneers</span>
        <div
          className='galleryCardContainer' 
          style={GalleryCardContainerStyle}>
          {artworks.map((item) => {
            return <GalleryCards 
                    key={uuidV4()}
                    title={item.title}
                    description={item.description}
                    author={item.author}
                    image={item.image}
                    date={item.date}
                    id={item.id} /> })}
        </div>
        
        <div 
          className="galleryCardPagination"
          style={GalleryCardPaginationStyle}>
          <button 
            style={{"fontSize" : "1.5rem", "padding":"0 0.2rem"}}
            onClick={()=>setPage(Math.max(page - 1, 1))}>&#8249;</button>
          <p>{page}</p>
          <button 
            style={{"fontSize" : "1.5rem", "padding":"0 0.2rem"}}
            onClick={()=>setPage(page + 1)}>&#8250;</button>
        </div>

      </main>

    </>
  );
}
