import type { NextPage } from "next";
import Image from "next/future/image";
import Register from "../src/components/Register";
import bg_img1 from "../public/bg_images/Bike_img.jpg";
import bg_img2 from "../public/bg_images/Park_img.jpg";
import bg_img3 from "../public/bg_images/Motorcycle_img.jpeg";
import bg_img4 from "../public/bg_images/terrace_img.jpeg";
const LandingPage: NextPage = () => {

  const background = [
    bg_img1,
    bg_img2,
    bg_img3,
    bg_img4,
  ]

  return (
    <div className="flex w-full h-full justify-center relative">
      <Image alt={"image"} src={background[2]} sizes="100%" priority={true} />
      <div>
        <button className="cursor-pointer">Log in</button>
      </div>
      <Register />
    </div>
  );
};
export default LandingPage;