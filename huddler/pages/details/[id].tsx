import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/future/image";
import { Huddle, User } from "../../src/types";
import { dateFormatter } from "../../src/utils/helperFunctions";
import { getUsersGoingToHuddle } from "../../src/utils/APIServices/huddleServices";
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
  const huddle: Huddle = useRouter().query;

  const dateTime = dateFormatter(huddle.day_time);
  const getter = async () => {
    const usersGoingTo = await getUsersGoingToHuddle(huddle.id);
    setUsers(usersGoingTo);
    const createdBy = await getUserById(huddle.fk_author_id);
    setCreator(createdBy[0]);
    const allMsgs = await getMsgsFromHuddle(huddle.id);
    setChatMsg(allMsgs);
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

  useEffect(() => {
    socketInitializer();
    getter();
  }, []);
  useEffect(() => {
    if (chatMsg && updateMsg)
      setChatMsg([
        ...chatMsg,
        {
          fk_huddle_id: updateMsg.huddle_id,
          message: updateMsg.message,
          username: updateMsg.username,
        },
      ]);
  }, [updateMsg]);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatMsg([
      ...chatMsg,
      {
        fk_huddle_id: huddle.id,
        message: e.target[0].value,
        username: user.username,
      },
    ]);
    //emits message e.target.value to room huddle.id
    socket.emit("input-change", e.target[0].value, huddle.id, user.username);
  };
  return (
    <div className="flex">
      <div
        id="huddle-details"
        className="h-screen w-[19rem] px-8 py-6 pb-0 mt-12 bg-white bg-opacity-20 shadow-xl"
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
        <p className="text-lg mb-2">{huddle.description}</p>
        <p>{huddle.address}</p>
        <p className="mt-4">Created By: {creator?.username}</p>
        <p className="my-2">Who's going:</p>
        {users ? (
          users.map((user: any, i: number) => {
            return (
              <p key={i} className="cursor-pointer mb-1">
                {user.username}
              </p>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div id="huddle-chat" className="grid grid-cols-1 w-full mb-24">
        <div className="border border-palette-orange mx-14 my-24 p-4 rounded-2xl bg-white bg-opacity-20 relative">
          <div>
            {chatMsg ? (
              chatMsg.map((msg, i) => {
                return msg.username === user.username ? (
                  <p key={i} className="justify-end text-blue-800">
                    {msg.message}
                  </p>
                ) : (
                  <p key={i} className="">
                    {msg.message}
                  </p>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 mb-6 rounded-xl h-12 w-full">
            <form onSubmit={(e) => submitHandler(e)}>
              <input type="text"></input>
              <button type="submit">Enter</button>
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
