import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/future/image";
import { Category, Huddle, User } from "../../src/types";
import { dateFormatter } from "../../src/utils/helperFunctions";
import {
  getHuddleCategories,
  getUsersGoingToHuddle,
} from "../../src/utils/APIServices/huddleServices";
import { getUserById } from "../../src/utils/APIServices/userServices";
import io from "socket.io-client";
import { getMsgsFromHuddle } from "../../src/utils/APIServices/chatService";
import { withSSRContext } from "aws-amplify";
import { GetServerSideProps } from "next";
let socket;

type Props = {
  aws_id: string;
  user: User;
};

const Details = ({ aws_id, user }: Props) => {
  const [chatMsg, setChatMsg] = useState<any[]>();
  const [updateMsg, setUpdateMsg] = useState<string>();
  const [users, setUsers] = useState<any>();
  const [creator, setCreator] = useState<User>();
  const [categories, setCategories] = useState<Category[]>();
  const huddle: Huddle = useRouter().query;

  const dateTime = dateFormatter(huddle.day_time);
  const getter = async () => {
    const usersGoingTo = await getUsersGoingToHuddle(huddle.id);
    setUsers(usersGoingTo);
    const createdBy = await getUserById(huddle.fk_author_id);
    setCreator(createdBy[0]);
    const allMsgs = await getMsgsFromHuddle(huddle.id);
    setChatMsg(allMsgs);
    const categories = await getHuddleCategories(huddle.id);
    setCategories(categories);
  };
  const socketInitializer = async () => {
    await fetch(`/api/chat/chat`);
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
    //join user the huddle room
    socket.emit("join-room", huddle.id);
    //gets the messaage
    socket.on("update-input", (msg) => {
      setUpdateMsg(msg);
    });
  };
  const scroll = () => {
    if (chatMsg) {
      const scrollTo = document.getElementById(chatMsg.length - 1 + "");
      scrollTo?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const isMessageFromUser = (current: string) => {
    return current == user.username;
  };
  useEffect(() => {
    socketInitializer();
    getter();
    scroll();
  }, []);
  useEffect(() => {
    if (chatMsg && updateMsg) {
      if (chatMsg[chatMsg.length - 1].message == updateMsg.message) return;

      setChatMsg([
        ...chatMsg,
        {
          fk_huddle_id: updateMsg.huddle_id,
          message: updateMsg.message,
          username: updateMsg.username,
        },
      ]);
      scroll();
    }
  }, [updateMsg]);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //emits message e.target.value to room huddle.id
    socket.emit("input-change", e.target[0].value, huddle.id, user.username);
    e.target[0].value = "";
  };
  return (
    <div className="flex">
      <div
        id="huddle-details"
        className=" w-[25rem] px-8 py-6 pb-0 bg-white bg-opacity-20 shadow-xl"
      >
        <p className="text-4xl font-extrabold text-palette-orange">
          {huddle.name}
        </p>
        <p>
          {" "}
          {dateTime.monthDayYear} at {dateTime.time}
        </p>
        <Image
          src={huddle.image}
          width={500}
          height={500}
          className="rounded-lg h-[13rem] w-[18rem] my-4"
          alt={huddle.name}
        />{" "}
        <p className="text-2xl mb-2">{huddle.description}</p>
        <p className="text-2xl">{huddle.address}</p>
        {categories ? (
          categories.map((category) => {
            return <p>{category.name}</p>;
          })
        ) : (
          <></>
        )}
        <p className="mt-4 text-4xl">Created By: </p>
        <div className="flex mb-4">
          <div className="relative h-12 w-12">
            <Image
              className="flex rounded-full "
              fill
              alt="user image"
              src={creator?.image}
            />
          </div>
          <p className="self-center ml-2 text-2xl">{creator?.username}</p>
        </div>
        <p className="my-2 text-4xl">Who's going:</p>
        {users ? (
          users.map((user: any, i: number) => {
            return (
              <div className="flex mb-4">
                <div className="relative h-12 w-12">
                  <Image
                    className="flex rounded-full "
                    fill
                    alt="user image"
                    src={user.image}
                  />
                </div>
                <p key={i} className="self-center ml-2 text-2xl">
                  {user.username}
                </p>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div id="huddle-chat" className="grid grid-cols-1 w-full mb-24">
        <div className="border border-palette-orange  mx-14 my-24 p-4 rounded-2xl shadow-lg bg-white bg-opacity-20 relative">
          <div className="h-[55rem] overflow-auto">
            {chatMsg ? (
              chatMsg.map((msg, i) => {
                let time;
                msg.time_of_creation
                  ? (time = msg.time_of_creation.slice(11))
                  : (time = "");
                return isMessageFromUser(msg.username) ? (
                  <div className="text-end bg-palette-orange ml-auto mr-0 mb-4 max-w-[60%] px-2 rounded-xl shadow-md">
                    {/* <p className="py-1 font-medium">{msg.username}</p> */}
                    <div className="flex pb-4 pt-2 justify-between">
                      {time ? <p className="opacity-60">{time}</p> : <></>}
                      <p id={i + ""} key={i}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className=" bg-palette-dark max-w-[60%] mb-4 p-2 pt-1 rounded-xl shadow-md">
                    <p className="py-1 font-medium">{msg.username}</p>
                    <div className="flex justify-between">
                      <p id={i + ""} key={i}>
                        {msg.message}
                      </p>
                      <p className="opacity-60">{time}</p>{" "}
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div className="inset-x-0 bottom-0 mb-6 rounded-xl h-12 bg-palette-dark bg-opacity-20 grid  content-center">
            <form onSubmit={(e) => submitHandler(e)}>
              <input
                type="text"
                className="ml-2 rounded-lg w-[90%] h-[80%] placeholder:pl-2"
                placeholder="Send a message . . ."
              ></input>
              <button
                className="bg-palette-dark bg-opacity-40 px-4 py-2 rounded-lg ml-4"
                type="submit"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { Auth } = withSSRContext({ req });

  try {
    const { username } = await Auth.currentUserInfo();
    const user: User[] = await getUserById(username);
    return {
      props: {
        aws_id: username,
        user: user.pop(),
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return {
      props: {},
    };
  }
};
