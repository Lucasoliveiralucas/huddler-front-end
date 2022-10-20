//MainForm

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Interests from "./FirstInterests";
import Location from "./SecondLocation";
import UserInfo from "./ThirdUserInfo";
import { Category, User } from "../../types";
import {
  postNewUserInfo,
  postUserCategory,
  getUserById,
} from "../../utils/APIServices/userServices";
import {
  getUploadUrl,
  uploadImgToS3,
} from "../../utils/APIServices/imageServices";

import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "../../Spinner";

function MainForm() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [userImg, setUserImg] = useState({});
  //@ts-ignore
  const { setCurrentUser, currentUser } = useAuth();
  const [location, setLocation] = useState({
    name: "",
    lat: 41.3873974,
    lng: 2.168568,
  });
  const [chosenCategories, setChosenCategories] = useState<Category[]>([]);
  const [userData, setUserData] = useState<any>(currentUser);
  const [spinner, setSpinner] = useState(false);
  let [disabledButton, setDisabledButton] = useState(true);

  console.log("this is userData", userData);

  const nextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("click");
    if (page < 3) {
      setPage(page + 1);
    } else {
      handleSubmit();
    }
  };

  const prevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSubmit = async () => {
    setSpinner(true);
    const data = await getUploadUrl();
    const uploadUrl = data.uploadURL;
    const filename = data.filename;
    const fileURL =
      "https://uploadertesthuddler12345.s3.eu-west-1.amazonaws.com/" + filename;

    setUserData({ ...userData, image: fileURL });
    await uploadImgToS3(uploadUrl, userImg);

    const formData = { ...userData, image: fileURL };
    console.log("This is userData", userData);

    // // posting new user info to db
    await postNewUserInfo(formData, userData.aws_id);
    setCurrentUser(formData);
    sessionStorage.setItem("user", JSON.stringify(formData));
    // // posting the categories to new huddle
    chosenCategories.forEach((category) => {
      postUserCategory(userData.aws_id, category.id as number);
    });
    router.replace("/home");
  };

  return (
    <>
      {spinner ? (
        <div className="absolute mt-[16%] ml-[22.5%]">
          <svg
            className="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-palette-dark"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="white"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="palette-dark"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <></>
      )}
      <div className="flex h-full items-center flex-col py-3">
        <h1 className="my-0">{page}/3</h1>
        <div className="h-[70vh] w-full flex justify-center">
          {page === 1 && (
            <Interests
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              setDisabledButton={setDisabledButton}
            />
          )}
          {page === 2 && (
            <Location
              location={location}
              setLocation={setLocation}
              setUserData={setUserData}
              userData={userData}
            />
          )}
          {page === 3 && (
            <UserInfo
              userData={userData!}
              setUserData={setUserData!}
              setUserImg={setUserImg}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
        <div className="flex gap-10">
          {page > 1 && (
            <button
              onClick={(e) => prevPage(e)}
              className="rounded-3xl hover:font-bold px-6 py-2 border-[1px]  border-palette-dark bg-transparent text-palette-dark"
            >
              Previous
            </button>
          )}
          {page > 2 ? (
            <button
              onClick={(e) => {
                nextPage(e);
                handleSubmit();
              }}
              className="rounded-3xl font-bold px-6 py-2 bg-palette-dark text-white"
            >
              Submit
            </button>
          ) : page === 1 ? (
            <button
              disabled={disabledButton}
              onClick={(e) => nextPage(e)}
              className="rounded-3xl font-bold px-6 py-2 bg-palette-dark text-white"
            >
              Next
            </button>
          ) : (
            <button
              onClick={(e) => nextPage(e)}
              className="rounded-3xl font-bold px-6 py-2 bg-palette-dark text-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default MainForm;
function postuserCategories(arg0: number, arg1: number) {
  throw new Error("Function not implemented.");
}
