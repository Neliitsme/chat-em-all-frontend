import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { HiArrowLeft, HiArrowUp } from "react-icons/hi";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import MessageOption from "../../components/MessageOption";
import Message from "../../components/Message";

export default function Chat({ props }: ChatProps) {
  const [messages, setMessages] = useState(props.messages);

  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  });

  const displayMessages = () => {
    return messages.map((message) => {
      return <Message key={message.id} props={message} />;
    });
  };

  return (
    <div>
      <div className="fixed p-2 top-0 inset-x-0 bg-zinc-800 z-10">
        <div className="flex h-12">
          <Link href={"/"} className="flex my-3">
            <HiArrowLeft size={24} />
            <p className="mr-6">Back</p>
          </Link>
          <Link href={""} className="flex">
            <div className="relative w-12">
              <Image src={"/avatar.jpg"} alt="" fill className="rounded-xl" />
            </div>
            <p className="font-bold text-lg m-2 mx-4">{props.username}</p>
          </Link>
        </div>
      </div>

      <div className="w-screen flex items-end mt-16 pb-48">
        <ul className="max-h-screen w-screen mb-48 flex flex-col ">
          {displayMessages()}
        </ul>
        <div ref={bottomRef} />
      </div>

      <div className="flex fixed bottom-0 inset-x-0 h-48 gap-4 px-2 py-2 items-end overflow-x-scroll z-10">
        <MessageOption
          emotion="😀"
          message="My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married."
        />
        <MessageOption emotion="🫤" message="Hello stranger" />
        <MessageOption
          emotion="😶"
          message="Stop! You have violated the Law! Pay the court a fine or serve your sentance. Your stolen goods are now forfeit"
        />
        <MessageOption
          emotion="😎"
          message="im swaggin im cool wassup"
          blurred
        />
      </div>

      {/* <form className="flex p-2 py-4 bg-zinc-800 fixed bottom-0 inset-x-0 z-10">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-12 px-4 mr-4 rounded-full bg-zinc-500"
        />
        <button className="px-3 rounded-full bg-amber-400">
          <HiArrowUp size={24} className="text-zinc-800" />
        </button>
      </form> */}
    </div>
  );
}

export interface ChatProps {
  props: {
    id: string;
    username: string;
    messages: [
      {
        id: string;
        date: string;
        content: string;
        from: string;
      }
    ];
  };
}

export async function getStaticPaths() {
  return {
    paths: [1].map((id) => ({
      params: { id: id.toString() },
    })),
    fallback: false,
  };
  // Return a list of possible value for id
}

export async function getStaticProps() {
  const props = {
    id: "1",
    username: "vaditel",
    messages: [
      {
        id: "1",
        date: new Date().toISOString(),
        content: "Hello",
        from: "vaditel",
      },
      {
        id: "2",
        date: new Date().toISOString(),
        content: "there",
        from: "vaditel",
      },
      {
        id: "3",
        date: new Date().toISOString(),
        content: "hi",
        from: "neli",
      },
      {
        id: "4",
        date: new Date().toISOString(),
        content: "Hello",
        from: "vaditel",
      },
      {
        id: "5",
        date: new Date().toISOString(),
        content: "there",
        from: "vaditel",
      },
      {
        id: "6",
        date: new Date().toISOString(),
        content: "hi",
        from: "neli",
      },
      {
        id: "7",
        date: new Date().toISOString(),
        content: "Hello",
        from: "vaditel",
      },
      {
        id: "8",
        date: new Date().toISOString(),
        content: "there",
        from: "vaditel",
      },
      {
        id: "9",
        date: new Date().toISOString(),
        content: "hi",
        from: "neli",
      },
      {
        id: "10",
        date: new Date().toISOString(),
        content: "Hello",
        from: "vaditel",
      },
      {
        id: "11",
        date: new Date().toISOString(),
        content:
          "ttheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretheretherehere",
        from: "vaditel",
      },
      {
        id: "12",
        date: new Date().toISOString(),
        content: "last",
        from: "neli",
      },
    ],
  };
  // Fetch necessary data for the blog post using params.id
  return {
    props: {
      props,
    },
  };
}
