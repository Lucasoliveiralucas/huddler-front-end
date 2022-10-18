import type { NextPage } from "next";
import Image from "next/future/image";
import Register from "../src/components/Register";
import bg_img1 from "../public/bg_images/Bike_img.jpg";
import bg_img2 from "../public/bg_images/Park_img.jpg";
import bg_img3 from "../public/bg_images/Motorcycle_img.jpeg";
import bg_img4 from "../public/bg_images/terrace_img.jpeg";
import Slider from "../src/components/Slider";

const LandingPage: NextPage = () => {

  const background = [
    bg_img1,
    bg_img2,
    bg_img3,
    bg_img4,
  ]

  return (
    <div className="w-full h-screen justify-center relative">
      <Slider></Slider>
      <button className="cursor-pointer
                       text-white
                       bg-palette-orange
                       absolute
                       transform
                       top-10
                       right-10
                       px-6
                       p-2
                       z-10
                       rounded-3xl
                       hover:scale-105
                       " >Log in</button>
      {/* <Image alt={"image"} src={background[2]} sizes="100%" priority={true} /> */}
      <h1 className="absolute z-10 left-[40vw] top-28 text-6xl font-extrabold text-slate-50">HUDDLER</h1>
      {/* <Register /> */}
    </div>
    
  );
};
export default LandingPage;