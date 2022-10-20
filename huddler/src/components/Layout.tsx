import Navbar from "./Navbar-components/Navbar";
import { useRouter } from "next/router";
import { MobileMenu } from "./Navbar-components/MobileMenu";

type Props = {
  children: JSX.Element;
};

function Layout({ children }: Props) {
  const router = useRouter().pathname.slice(1);

  return (
    <>
      <div
        className="w-full h-screen flex flex-col justify-center"
        id="carousel"
      >
        {router && <Navbar />}
        <div className="self-center h-full w-full grid" id="carousel">
          <main>{children}</main>
        </div>
      <MobileMenu />
      </div>
      {/* <Footer /> */}
    </>
  );
}
export default Layout;
