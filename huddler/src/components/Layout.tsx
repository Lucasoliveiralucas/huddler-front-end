import Navbar from "./Navbar-components/Navbar";

type Props = {
  children: JSX.Element;
};

function Layout({ children }: Props) {
  return (
    <>
      <div
        className="w-full h-screen flex flex-col justify-center"
        id="carousel"
      >
        {currentUser && <Navbar />}
        <div className="self-center h-full w-full grid" id="carousel">
          <main>{children}</main>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
export default Layout;
