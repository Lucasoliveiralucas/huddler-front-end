import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { AiOutlineCompass } from 'react-icons/ai';
import Link from 'next/link';

const serviceDropdown = [
    { name: 'Explore', path: '/home', icon: <AiOutlineCompass /> },
    { name: 'Profile', path: '/profile', icon: <CgProfile /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
    { name: 'Log Out', path: '/', icon: <HiOutlineLogout /> },
];

export const MobileMenu = () => {
    return (
        <div className="bg-black fixed bottom-0 h-12 w-full md:hidden flex justify-around text-white items-center text-3xl">
            {serviceDropdown.map((item) => {
                return (
                    <Link href={item.path}>
                        <div>
                            {item.icon}
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
