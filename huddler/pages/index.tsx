import type { NextPage } from "next";
import Image from "next/future/image";
import Register from "../src/components/Register";
import bg_img1 from "../public/bg_images/Bike_img.jpg";
import bg_img2 from "../public/bg_images/Park_img.jpg";
import bg_img3 from "../public/bg_images/Motorcycle_img.jpeg";
import bg_img4 from "../public/bg_images/terrace_img.jpeg";
import Slider from "../src/components/Slider";
import { useState } from "react";

const LandingPage: NextPage = () => {

  const background = [
    bg_img1,
    bg_img2,
    bg_img3,
    bg_img4,
  ]

  const [click, setClick] = useState(false);
  const [button, setButton] = useState('Log in')

  const toggle = () => {
    if (click) {
      setButton('Log in');
      setClick(false);
      return
    }
    setClick(true);
    setButton('Back');
  }

  return (
    <div className="w-full h-screen justify-center relative">
      <Slider></Slider>
      <button className="orange-button absolute transform top-10 right-10 z-10" onClick={toggle}>{button}</button>
      {/* <Image alt={"image"} src={background[2]} sizes="100%" priority={true} /> */}
      <h1 className="absolute z-[1] left-[40vw] top-28 text-6xl font-extrabold text-slate-50">HUDDLER</h1>
      {click && <Register />}
    </div>
    
  );
};
export default LandingPage;