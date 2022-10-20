// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { Category, Huddle } from '../../types';
import { nowFormatted } from '../../utils/helperFunctions';
import Image from 'next/future/image';
import { useRouter } from 'next/router';
import TagList from '../TagList';
import AutocompleteHuddleForm from './AutocompleteNewHuddleForm';
import {
  getIdOfHuddleByDateOfCreation,
  postHuddle,
  postHuddleCategory,
  postUserGoingToHuddle,
} from '../../utils/APIServices/huddleServices';
import {
  getUploadUrl,
  uploadImgToS3,
} from '../../utils/APIServices/imageServices';
import { useAuth } from '../../contexts/AuthContext';
import { FaWindowClose } from 'react-icons/fa';

type Props = {
  id: string;
  data: {
    name: string;
    lat: string;
    lng: string;
  };
  update?: boolean;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  center: {
    lat: number;
    lng: number;
  };
};

const NewHuddleForm = ({ data, setCenter, center, id }: Props) => {
  const router = useRouter();
  //@ts-ignore
  const { currentUser } = useAuth();

  const [imgUrl, setImageUrl] = useState({});
  const [uploadImg, setUploadImg] = useState({});
  const [imageSelected, setImageSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [addedCategories, setAddedCategories] = useState<Category[]>([
    { id: 0, name: '' },
  ]);
  const [allCategories, setAllCategories] = useState([{ id: 0, name: '' }]);
  const [error, setError] = useState('');
  const [locationData, setLocationData] = useState({
    name: '',
    lat: '1.39',
    lng: '2.154',
  });
  const [finalLocation, setFinalLocation] = useState(locationData);

  const titleRef = useRef<HTMLInputElement>(null);
  const whenRef = useRef<HTMLInputElement>(null);
  const categoriesInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await getUploadUrl();
      const uploadUrl = data.uploadURL;
      const filename = data.filename;
      console.log(data);
      uploadImgToS3(uploadUrl, uploadImg);

      //

      setError('');
      const date = Date.now();
      const newHuddle: Huddle = {
        name: titleRef.current!.value,
        day_time: whenRef.current!.value,
        longitude: +finalLocation.lng,
        latitude: +finalLocation.lat,
        address: finalLocation.name,
        description: descriptionRef.current!.value,
        image: `${process.env.NEXT_PUBLIC_AWS_UPLOAD_IMAGE}/filename`,
        date_of_creation: date,
        link: '',
        fk_author_id: currentUser.aws_id, //here we'll require the uid from the authentication
      };
      // Post huddle in DB
      console.log('new huddle', newHuddle);
      console.log('user', currentUser.aws_id);
      const huddleDateOfCreation = await postHuddle(newHuddle);

      // getting id of huddle
      const huddleId = await getIdOfHuddleByDateOfCreation(date);

      //posting the categories to new huddle
      addedCategories.forEach((el) => {
        postHuddleCategory(huddleId[0].id, el.id as number);
      });
      closeHuddleForm();

      // //the user that creates the huddle goes by default
      await postUserGoingToHuddle(currentUser.aws_id, huddleId);
    } catch {
      setError('We could not create the huddle');
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImageSelected(true);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    const img = e.target.files[0];
    console.log(img);
    setUploadImg(img);
  };
  const closeHuddleForm = () => {
    const body = document.body;
    const form = document.getElementById('huddle-form');
    body?.classList.remove('overflow-hidden');
    form?.classList.remove('animate-fade-in');
    form?.classList.add('animate-fade-out');
    setTimeout(() => {
      // window.scrollTo(0, 0);
      // body?.classList.add("overflow-hidden");
      form?.classList.remove('absolute');
      form?.classList.add('hidden');
    }, 500);
  };
  let huddleCategories: string[] = [];

  const addCategory = (category: Category) => {
    //@ts-ignore
    if (allCategories.includes(category)) {
      categoriesInputRef.current!.value = '';
      setAllCategories([]);
      return;
    }
    addedCategories[0].name == ''
      ? setAddedCategories([category])
      : setAddedCategories([...addedCategories, category]);
    console.log('These are the selected categories,', addedCategories);
    categoriesInputRef.current!.value = '';
    setAllCategories([]);
  };

  useEffect(() => {
    if (locationData.lat !== '1.39')
      setCenter({
        lat: Number(locationData.lat),
        lng: Number(locationData.lng),
      });
    setFinalLocation(locationData);
  }, [locationData]);

  useEffect(() => {
    if (center)
      setFinalLocation({
        ...finalLocation,
        lat: '' + center.lat,
        lng: '' + center.lng,
      });
  }, [center]);

  return (
    // <main className="w-[100%]"
    <main
      id='huddle-form'
      className='
      top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      absolute
      flex-col
      items-center
      p-8
      bg-[rgb(248,241,229)]
      w-[75vw]
      md:w-[60vw]
      lg:w-[50vw]
      shadow-md
      rounded-md
      border-solid
      border-[0.5px]
      border-palette-dark'
    >
      <div className='relative'>
        <button
          className='absolute ml-[98%]'
          onClick={(e) => closeHuddleForm()}
        >
          <FaWindowClose color='#CC0000' />
        </button>
        <h1 className='text-center text-lg font-medium text-palette-orange mt-0'>
          {"Let's make a new huddle"}
        </h1>
        {error && (
          <>
            <div className='text-[#721D25] bg-[#F8D6DB] p-5 rounded-md'>
              {error}
            </div>
            <br />
          </>
        )}

        <form
          className='flex flex-col'
          onSubmit={handleSubmit}
        >
          <label htmlFor='title'>Title</label>
          <input
            className='outline-palette-orange outline-1 shadow-sm rounded-md'
            ref={titleRef}
            type='text'
            id='title'
            autoComplete='on'
            required
          />
          <label
            htmlFor='categories'
            className='mt-6'
          >
            Pick the tags of your huddle
          </label>

          {
            <div className='my-3 mt-2'>
              <ul className='flex gap-2'>
                {addedCategories.map((category, i) => {
                  return (
                    <li
                      key={i}
                      className='p-4
  text-center
  font-bold
  rounded-2xl
  py-0.5
  px-10
  border-palette-dark
  border-[1px]
  bg-tansparent
  text-palette-dark
  cursor-pointer
  active:translate-x-[1px]
  active:translate-y-[1px]
  hover:opacity-50'
                      onClick={() =>
                        setAddedCategories(
                          addedCategories.filter((word) => word != category)
                        )
                      }
                    >
                      {category.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          }

          <TagList
            categoriesInputRef={categoriesInputRef}
            setAllCategories={setAllCategories}
          />
          {allCategories[0] ? (
            <div
              className='absolute w-[22rem] mt-[11rem] mr- bg-palette-light p-2  rounded-2xl
  border-palette-dark
  border-[1px] shadow-sm'
            >
              <ul className='grid grid-cols-3 gap-2'>
                {allCategories.map((category, i) => (
                  <li
                    key={i}
                    className='p-4
  text-center
  font-bold
  py-0.5
  rounded-2xl
  bg-tansparent
  text-palette-light
  bg-orange-600
  cursor-pointer
  active:translate-x-[1px]
  active:translate-y-[1px]
  hover:opacity-50'
                    onClick={() => addCategory(category)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
          <label
            className='mt-2'
            htmlFor='where'
          >
            Where?
          </label>
          <AutocompleteHuddleForm
            stockValue={data.name}
            locationData={locationData}
            setLocationData={setLocationData}
          />
          <label
            className='mt-2'
            htmlFor='when'
          >
            When?
          </label>
          <input
            className='outline-palette-orange outline-1 shadow-sm rounded-md'
            ref={whenRef}
            type='datetime-local'
            id='dateTime'
            autoComplete='on'
            min={nowFormatted()}
            required
          />
          <label
            className='mt-2'
            htmlFor='description'
          >
            What is your huddle?
          </label>
          <textarea
            className='outline-palette-orange outline-1 shadow-sm rounded-md'
            ref={descriptionRef}
            id='description'
            autoComplete='on'
            placeholder='Add a description'
            required
          />
          <div className='flex'>
            <div className='flex flex-col mt-2'>
              <label
                htmlFor='images'
                className='mb-4'
              >
                Add images to your huddle:
              </label>
              <input
                className='border-none'
                ref={imagesRef}
                type='file'
                accept='.jpg, jpeg, .png, .gif'
                onChange={onSelectFile}
                id='images'
              />
            </div>
            {imageSelected && (
              <figure>
                <Image
                  className='ml-10'
                  width={100}
                  height={100}
                  id='image-preview'
                  alt='image-preview'
                  src={imagePreview}
                />
              </figure>
            )}
          </div>
          <button
            className='orange-button mt-6'
            type='submit'
          >
            Submit
          </button>
          {/* <button
          className="border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white font-medium mt-2"
          type="submit"
        >
          Submit
        </button> */}
        </form>
      </div>
    </main>
  );
};

export default NewHuddleForm;

