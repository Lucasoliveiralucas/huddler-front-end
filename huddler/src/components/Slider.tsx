import React from 'react';
import { Fade, Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import bg_img1 from "../../public/bg_images/Bike_img.jpg";
import bg_img2 from "../public/bg_images/Park_img.jpg";
import bg_img3 from "../../public/bg_images/Motorcycle_img.jpeg";
import bg_img4 from "../../public/bg_images/terrace_img.jpeg";
import Image from "next/future/image";
// import nn from '../../public/bg_images/Bike_img'

const fadeImages = [
  // {url: "https://cdn.https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/roa070120fea-bikesupcoast-03-1595952354.jpgmotor1.com/images/mgl/JR4VM/s3/12-reasons-to-ride-a-motorcycle.jpg"},
  {url: "https://www.thespruce.com/thmb/W7fMK4ljIYbKtW9YdiFOyozjhfU=/1600x1200/smart/filters:no_upscale()/GettyParty-5b35eb3c46e0fb003788537e.jpg"},
  {url: "https://static.toiimg.com/photo/msid-75490045,width-96,height-65.cms"},
  {url: "https://cdn.shopify.com/s/files/1/0021/5701/9254/articles/Felt_Bicycles_Group_Ride_Tips_MAIN_2048x.jpg"}];

const Slider = () => {

  return (
    <div className="slide-container">
      <Slide>
        {fadeImages.map((fadeImage, key) => (
          <div className="each-slide" key={key}> 
            <div style={{backgroundImage: `url(${fadeImage.url})`}}>
       
              {/* <img width="800" height="600" alt="background-slider" src={fadeImage.url} /> */}
            </div>
          </div>
        ))}
      </Slide>
    </div>
  )

  



  return (
    <div></div>
  );

}

export default Slider;