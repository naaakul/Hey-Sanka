import React from "react";

type ChatItem = {
  user: { mess: string };
  bot: { mess: string; link?: string; zip?: string };
};

const Chat = ({Chats}: {Chats: ChatItem[]}) => {
  return (
    <div className="h-screen w-[60rem] mx-auto flex flex-col text-neutral-300">
      <div className="flex-1 flex flex-col gap-4 p-4 pt-80 overflow-y-auto hide-scrollbar">
        {Chats.map((chat, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <p className="self-start max-w-[70%] px-3 py-1 rounded">
              {chat.user.mess}
            </p>

            <p className="self-end max-w-[70%] px-3 py-1 rounded">
              {chat.bot.mess}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
