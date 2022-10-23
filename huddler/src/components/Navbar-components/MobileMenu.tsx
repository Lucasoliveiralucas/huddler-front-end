import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { AiOutlineCompass } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

const serviceDropdown = [
    { name: 'Explore', path: '/home', icon: <AiOutlineCompass /> },
    { name: 'Profile', path: '/profile', icon: <CgProfile /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
    { name: 'Log Out', path: '/', icon: <HiOutlineLogout /> },
];

export const MobileMenu = () => {
    const router = useRouter();

    return (
        <>
            {router.pathname !== '/' &&
                <div className="bg-palette-dark fixed bottom-0 h-12 w-full md:hidden flex justify-around text-white items-center text-3xl">
                    {serviceDropdown.map((item) => {
                        return (
                            <Link href={item.path} key={item.name}>
                                <div>
                                    {item.icon}
                                </div>
                            </Link>
                        )
                    })}
                </div>}
        </>
    )
}
