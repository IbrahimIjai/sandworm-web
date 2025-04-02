"use client";

import { FaRegStar, FaCodeBranch } from "react-icons/fa";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useRouter } from "next/navigation";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useSandwormStore } from "@/store";

import { DicebearAvatar } from "../DicebearAvatar";

const QueryCard = ({ query }: { query: any }) => {
  const { createTab } = useSandwormStore();
  const router = useRouter();

  const openQueryInTab = (queryData: any) => {
    createTab(queryData.name, "sql", queryData.query);
    router.push("/workspace");
  };

  return (
    <div className="shadow-sm rounded-xl p-4 px-8   flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="flex">
          <DicebearAvatar seed={query.author.id} size={30} />
          <div className="ml-3">
            <div className="text-[0.8rem] font-medium">
              <Link
                href={`/creators/${query.author.id} `}
                className="hover:underline"
              >
                {query.author.id}
              </Link>{" "}
              / {query.name}{" "}
            </div>
            <p className="text-xs text-[#ffffff90]">
              created {new Date(query.updatedAt).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center font-medium text-[#ffffff90] space-x-1">
            <FaCodeBranch className="text-sm" />
            <span className="text-xs">3 Forks</span>
          </div>
          <div className="flex items-center font-medium text-[#ffffff90] space-x-1">
            <FaRegStar className="text-sm" />
            <span className="text-xs">3 Stars</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="  mt-2 text-sm"
        onClick={() => openQueryInTab(query)}
      >
        <SyntaxHighlighter
          language="sql"
          style={{
            ...twilight,
          }}
          customStyle={{
            margin: 0,
            background: "#ffffff10",
            borderRadius: 0,
            borderWidth: 1,
            borderColor: "#ffffff25",
          }}
          wrapLines
          wrapLongLines
          showInlineLineNumbers
          showLineNumbers
          className="h-[10rem] rounded-none my-0"
        >
          {query.query}
        </SyntaxHighlighter>
      </button>
    </div>
  );
};

export default QueryCard;
