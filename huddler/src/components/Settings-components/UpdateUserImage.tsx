import Image, { StaticImageData } from 'next/future/image';
import DefaultUserImage from '../../../public/defaultUserImage.png';
import { useState, useRef } from 'react';
import { User } from '../../types'

type Props = {
  setDisabledButton: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  image?: string;
  userPersonalInfo: any;
  // userData: User;
  setNewImg: React.Dispatch<React.SetStateAction<Object>>;
  setAddedImg: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserImage = ({
  setDisabledButton,
  setError,
  userPersonalInfo,
  setNewImg,
  setAddedImg,
}: Props) => {
  const [userImage, setUserImage] = useState<StaticImageData | string>(
    userPersonalInfo.image
  );
  const imageRef = useRef<HTMLInputElement>(null);

  const changeUserImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    try {
      //Update image in DB
      // userPersonalInfo.image = e.target.files[0];
      setUserImage(URL.createObjectURL(e.target.files[0]));
      // image = URL.createObjectURL(e.target.files[0]);
      setNewImg(e.target.files[0])
      setAddedImg(true)
      setDisabledButton(false);
    } catch {
      setError('Failed to upload the new user image. Please try again');
    }
  };
  console.log(userPersonalInfo);

  return (
    <div className='flex flex-col items-center mb-10'>
      Click on the image to change it
      <input
        type='file'
        ref={imageRef}
        className='hidden'
        accept='.jpg, jpeg, .png, .gif'
        onChange={changeUserImage}
      />
      <div className="relative h-[15rem] w-[15rem]">
        <Image
        src={userImage || userPersonalInfo.image || DefaultUserImage}
        className='rounded-full hover:cursor-pointer'
        fill
        alt='user-image'
        sizes='(max-width: 768px) 0px,
                       (max-width: 1200px) 300px,
                       400px'
        onClick={() => imageRef.current!.click()}
        />
      </div>
      
    </div>
  );
};

export default UserImage;


