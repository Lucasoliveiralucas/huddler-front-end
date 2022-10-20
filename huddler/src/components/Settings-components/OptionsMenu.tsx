import Image from 'next/future/image';
import { useState } from 'react';
import rightArrow from '../../../public/right-arrow.png';

const arrowImage = (
  <Image
    src={rightArrow}
    width={20}
    height={30}
    alt='right-arrow'
  />
);

//Css classes
const defaultClass =
  'flex justify-between lg:text-lg items-center lg:py-8 h-full border-b-[0.2px] border-solid border-gray-300 hover:cursor-pointer whitespace-nowrap p-3 gap-20 hover:bg-palette-orange focus:bg-gray-300';
const defaultClassTop = defaultClass + '  rounded-t-[15px]';
const defaultClassBottom = defaultClass + '  rounded-b-[15px]';

type Props = {
  setOption: React.Dispatch<React.SetStateAction<string>>;
};

const OptionsMenu = ({ setOption }: Props) => {
  const [selected, setSelected] = useState({
    information: true,
    password: false,
    location: false,
    interests: false,
    delete: false,
  });

  //once an option in the menu of settings page is clicked
  const handleOption = async (e: React.MouseEvent<HTMLLIElement>) => {
    for (let option of Object.keys(selected)) {
      //@ts-ignore
      if (selected[option] === true) selected[option] = false;
    }
    const option = e.currentTarget.id;
    setSelected((selected) => ({ ...selected, [option]: true }));
    setOption(option);
  };

  return (
    // <div className='fixed left-6'>
    <ul className='flex flex-col justify-center mt-16 md:mr-10 xl:mr-48 lg:mr-10 shadow-md font-medium border-solid border-palette-orange border-[0.2px] rounded-[15px]'>
      <li
        className={
          selected.information
            ? defaultClassTop + ' bg-palette-orange text-white'
            : defaultClassTop
        }
        onClick={handleOption}
        id='information'
      >
        Personal information
        {arrowImage}
      </li>
      <li
        className={
          selected.password ? defaultClass + ' bg-palette-orange text-white' : defaultClass
        }
        onClick={handleOption}
        id='password'
      >
        Change your password
        {arrowImage}
      </li>
      <li
        className={
          selected.location ? defaultClass + ' bg-palette-orange text-white' : defaultClass
        }
        onClick={handleOption}
        id='location'
      >
        Update default location
        {arrowImage}
      </li>
      <li
        className={
          selected.interests
            ? defaultClass + ' bg-palette-orange text-white'
            : defaultClass
        }
        onClick={handleOption}
        id='interests'
      >
        Update interests
        {arrowImage}
      </li>
      <li
        className={
          selected.delete
            ? defaultClassBottom + ' bg-palette-orange text-white'
            : defaultClassBottom
        }
        onClick={handleOption}
        id='delete'
      >
        Delete your account
        {arrowImage}
      </li>
    </ul>
    // </div>
  );
};

export default OptionsMenu;

