import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/future/image";
import { Category, Huddle, User } from "../../src/types";
import { dateFormatter } from "../../src/utils/helperFunctions";
import {
  getHuddleById,
  getHuddleCategories,
  getUsersGoingToHuddle,
  postUserGoingToHuddle,
  removeUserGoingToHuddle,
} from "../../src/utils/APIServices/huddleServices";
import { getUserById } from "../../src/utils/APIServices/userServices";
import io, { Socket } from "socket.io-client";
import { getMsgsFromHuddle } from "../../src/utils/APIServices/chatService";
import { withSSRContext } from "aws-amplify";
import { GetServerSideProps } from "next";
import { Router } from "@aws-amplify/ui-react/dist/types/components/Authenticator/Router";
let socket: Socket;

type Props = {
  aws_id: string;
  user: User;
  huddle: Huddle;
};

const Details = ({ aws_id, user, huddle }: Props) => {
  const [chatMsg, setChatMsg] = useState<any[]>();
  const [updateMsg, setUpdateMsg] = useState<{
    huddle_id: number;
    message: string;
    username: string;
  }>();
  const [users, setUsers] = useState<any>();
  const [creator, setCreator] = useState<User>();
  const [categories, setCategories] = useState<Category[]>();
  const [going, setGoing] = useState<string>();
  // @ts-ignore
  // const huddle: Huddle = useRouter().query;

  const dateTime = dateFormatter(huddle.day_time);
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
    socketInitializer();
  }, []);

  useEffect(() => {
    const getter = async () => {
      const usersGoingTo = await getUsersGoingToHuddle(huddle.id);
      setUsers(usersGoingTo);

      usersGoingTo.find((users: User) => {
        return users.aws_id == aws_id;
      })
        ? setGoing("Leave")
        : setGoing("Join");
      const createdBy = await getUserById(huddle.fk_author_id);
      setCreator(createdBy[0]);
      const allMsgs = await getMsgsFromHuddle(huddle.id);
      setChatMsg(allMsgs);
      const categories = await getHuddleCategories(huddle.id);
      setCategories(categories);
    };
    getter();
  }, [going]);

  useEffect(() => {
    if (chatMsg && updateMsg && chatMsg[0]) {
      if (chatMsg[chatMsg.length - 1].message == updateMsg.message) return;

      setChatMsg([
        ...chatMsg,
        {
          fk_huddle_id: updateMsg.huddle_id,
          message: updateMsg.message,
          username: updateMsg.username,
        },
      ]);
    }
  }, [updateMsg]);
  useEffect(() => {
    scroll();
  }, [chatMsg]);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //emits message e.target.value to room huddle.id
    // @ts-ignore
    socket.emit("input-change", e.target[0].value, huddle.id, user.username);
    // @ts-ignore
    e.target[0].value = "";
  };
  return (
    <div className="flex h-screen w-screen" id="0">
      <div
        id="huddle-details 1-left"
        className="overflow-y-auto flex flex-col w-[40vw] h-screen pt-24 px-8 bg-white bg-opacity-20 shadow-xl"
      >
        <p className="text-3xl font-yantra font-extrabold text-palette-orange">
          {huddle.name}
        </p>
        <p className="pt-2 text-palette-dark font-karla">
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
        <p className="mt-2 text-xl font-medium font-yantra text-palette-dark">DESCRIPTION</p>
        <p className="text-lg mb-2 font-karla text-palette-black">{huddle.description}</p>
        <p className="mt-2 text-xl font-medium font-yantra text-palette-dark">LOCATION</p>
        <p className="text-lg mb-2 font-karla text-palette-black">{huddle.address}</p>
        <div className="grid grid-cols-3 gap-x-1 gap-y-2 mr-3 mt-2 mb-2 w-full">
          {categories ? (
            categories.map((category, i) => {
              return (
                <p key={i} className="category-icon">
                  {category.name}
                </p>
              );
            })
          ) : (
            <></>
          )}
        </div>
        <p className="mt-4 mb-2 text-xl font-medium font-yarna text-palette-dark">
          CREATED BY:{" "}
        </p>
        <div className="flex mb-2">
          <div className="relative h-12 w-12">
            <Image
              className="flex rounded-full "
              fill
              alt="user image"
              sizes="(max-width: 768px) 0px,
                       (max-width: 1200px) 300px,
                       400px"
              // @ts-ignore
              src={creator?.image}
            />
          </div>
          <p className="self-center ml-3 text-xl text-palette-black font-karla">
            {creator?.username}
          </p>
        </div>
        <p className="mt-4 mb-2 text-xl font-medium font-yarna text-palette-dark">
          WHO&apos;S GOING:
        </p>
        {users ? (
          users.map((user: any, i: number) => {
            return (
              <div key={i} className="flex mb-4">
                <div className="relative h-12 w-12">
                  <Image
                    className="flex rounded-full"
                    fill
                    alt="user image"
                    src={user.image}
                    sizes="(max-width: 768px) 0px,
                       (max-width: 1200px) 300px,
                       400px"
                  />
                </div>
                <p key={i} className="self-center ml-3  font-karla text-palette-black text-xl">
                  {user.username}
                </p>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div id="huddle-chat 1-right" className="flex flex-col w-full">
        <button
          onClick={async (e) => {
            if (going === "Join") {
              await postUserGoingToHuddle(user.aws_id, huddle.id);
              setGoing("Leave");
            } else {
              await removeUserGoingToHuddle(user.aws_id, huddle.id);
              setGoing("Join");
            }
          }}
          className={`mr-14 ml-auto mt-24 h-12 justify-center ${
            going === "Leave" ? "leave-button" : "orange-button"
          }`}
        >
          {going}
        </button>
        <div className="border border-palette-orange mx-12 h-[75%] mt-2 px-4 rounded-2xl shadow-lg bg-white bg-opacity-20 object-contain">
          <div className="flex flex-col h-[95%]">
            <div className="overflow-auto ">
              {chatMsg ? (
                chatMsg.map((msg, i) => {
                  let time;
                  msg.timezone
                    ? (time = msg.timezone.slice(11, 16))
                    : (time = dateFormatter(
                        // @ts-ignore
                        Date.now() // Don't turn this into a string!!!
                      ).time);
                  return isMessageFromUser(msg.username) ? (
                    <div
                      key={i}
                      className="text-end bg-palette-orange bg-opacity-50 ml-auto mr-0 mb-4 max-w-[60%] px-2 rounded-xl shadow-md"
                    >
                      {/* <p className="py-1 font-medium">{msg.username}</p> */}
                      <div className="flex pb-4 pt-6 justify-between">
                        {time ? <p className="opacity-60">{time}</p> : <></>}
                        <p id={i + ""} key={i}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className=" bg-palette-dark bg-opacity-30 max-w-[60%] mb-4 p-2 pt-1 rounded-xl shadow-md"
                    >
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
            <div className="relative h-24 mt-2 rounded-xl bg-palette-dark bg-opacity-20">
              <form
                className="flex p-2 h-full w-full items-center"
                onSubmit={(e) => submitHandler(e)}
              >
                <input
                  type="text"
                  className="ml-2 rounded-lg w-[85%] h-[80%] placeholder:pl-2"
                  placeholder="Send a message"
                ></input>
                <button
                  className="bg-palette-dark h-[80%] w-[12%] bg-opacity-40 px-6 py-2 rounded-lg ml-4 text-orange-100 font-bold self-center"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { Auth } = withSSRContext({ req });
  try {
    const id = parseInt(query.id as string);
    const huddle = await getHuddleById(id);
    const { username } = await Auth.currentUserInfo();
    const user: User[] = await getUserById(username);
    return {
      props: {
        huddle: huddle.pop(),
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
