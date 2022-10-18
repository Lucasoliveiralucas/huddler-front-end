import Navbar from './Navbar-components/Navbar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  children: JSX.Element;
};

function Layout({ children }: Props) {

  const { currentUser } = useAuth()
  
  return (
    <>
      <div className='w-full h-screen flex flex-col justify-center' id="carousel">
        { currentUser && <Navbar /> }
        <div className='self-center h-full w-full grid' id="carousel">
          <main>{children}</main>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
export default Layout;

