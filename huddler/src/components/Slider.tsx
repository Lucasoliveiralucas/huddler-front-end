import Image from "next/image";
import React from "react";
import { Fade, Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import logo from "../../public/huddler-orange-w-logo.png";

const fadeImages = [
  {
    url: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/roa070120fea-bikesupcoast-03-1595952354.jpg",
  },
  {
    url: "https://static.toiimg.com/photo/msid-75490045,width-96,height-65.cms",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0021/5701/9254/articles/Felt_Bicycles_Group_Ride_Tips_MAIN_2048x.jpg",
  },
];

const Slider = () => {
  return (
    <>
      <div className="slide-container w-full relative bg-black">
        <div className="absolute flex w-full justify-center top-[12%] md:top-[8%] lg:top-[5%]">
          <Image
            alt="logo"
            src={logo}
            placeholder="blur"
            width={800}
            height={150}
            objectFit="contain"
            className="z-10"
            />
        </div>
        
        <Fade>
          {fadeImages.map((fadeImage, key) => (
            <div
              className="each-fade brightness-50"
              key={key}
              style={{
                backgroundImage: `url(${fadeImage.url})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
          ))}
        </Fade>
      </div>
    </>
  );
};

export default Slider;
