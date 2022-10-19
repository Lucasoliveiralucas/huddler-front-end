import React from 'react';
import { Fade, Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const fadeImages = [
  {url: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/roa070120fea-bikesupcoast-03-1595952354.jpg"},
  {url: "https://static.toiimg.com/photo/msid-75490045,width-96,height-65.cms"},
  {url: "https://cdn.shopify.com/s/files/1/0021/5701/9254/articles/Felt_Bicycles_Group_Ride_Tips_MAIN_2048x.jpg"}];

const Slider = () => {

  return (
    <>
    <div className="slide-container w-screen bg-black">
      <Fade>
        {fadeImages.map((fadeImage, key) => (
          <div className="each-fade brightness-[0.25]"
          key={key}
          style={
            {backgroundImage: `url(${fadeImage.url})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}> 
          </div>
        ))}
      </Fade>
    </div>
    </>
  )
}

export default Slider;