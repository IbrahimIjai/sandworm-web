"use client";

import { FaRegStar, FaStar, FaCodeBranch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  twilight,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

import type { Query } from "@/types";
import { useQueryLike } from "@/hooks/useLikeQuery";
import { useModalStore } from "@/store/auth";
import { useForkQuery } from "@/hooks";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface QueryCardProps {
  query: Query;
  liked: boolean;
}

export const QueryCard = ({ query, liked }: QueryCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const openSignIn = useModalStore(state => state.openSignIn);
  const { toggleLike, loading } = useQueryLike(query.id, liked);
  const { handleFork, loading: loadingfork } = useForkQuery(query.id);

  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);

  const { theme } = useTheme();

  const handleQueryClick = () => {
    router.push(`/console/${query.id}`);
  };

  // we open signin modal if user attempt to like or fork query when not logged in
  const handleLikeClick = () => {
    if (!session?.user?.id) return openSignIn();
    return toggleLike();
  };

  const handleForkClick = () => {
    if (!session?.user?.id) return openSignIn();
    return handleFork();
  };

  // we truncate long ass description and check if we should even do that
  const truncatedDescription = query.description?.slice(0, 100) || "";
  const shouldTruncate = query.description?.length > 100;

  const getSyntaxConfig = (currentTheme: string) => {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const isDark =
      currentTheme === "dark" || (currentTheme === "system" && systemDark);

    return {
      style: isDark ? twilight : prism,
      background: isDark ? "#0a0a0a" : "#D7E2E7",
      borderColor: isDark ? "#333" : "#D4DCDF",
    };
  };

  const {
    style: syntaxStyle,
    background: syntaxBg,
    borderColor,
  } = getSyntaxConfig(theme);

  return (
    <div className="shadow-sm rounded-xl p-4 md:px-8 px-5 flex flex-col justify-between">
      <div className="flex justify-between items-start flex-col md:flex-row">
        <div className="flex items-start">
          <div className="hidden md:block">
            {query.image ? (
              <Image
                alt="user avatar"
                src={query.image}
                width={25}
                height={25}
                unoptimized
                className="rounded-full border-2"
              />
            ) : (
              <Avatar className="h-64 w-64">
                <AvatarFallback>
                  {query.creator?.split(" ")[0]?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="md:ml-3 md:text-sm text-[13px]">
            <Link
              href={`/creators/${query.creator}`}
              className="hover:underline font-medium"
            >
              {query.username}
            </Link>
            <span className="mx-1">/</span>
            <Link
              href={`/console/${query.id}`}
              className="hover:underline"
              onClick={handleQueryClick}
            >
              {query.title}
            </Link>
            <p className="text-xs dark:text-[#ffffff90] capitalize">
              created {new Date(query.updatedAt).toLocaleDateString("en-US")}
            </p>
            {query.description && (
              <p className="text-xs mt-1 dark:text-white">
                {showFullDesc || !shouldTruncate
                  ? query.description
                  : `${truncatedDescription}... `}
                {shouldTruncate && (
                  <button
                    type="button"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-orange-400 ml-1 hover:underline"
                  >
                    {showFullDesc ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex  gap-4 items-center dark:text-[#ffffff90] text-xs mt-3 md:mt-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleForkClick}
              disabled={loadingfork}
              className="hover:text-white"
            >
              <FaCodeBranch className="text-sm" />
            </button>
            <span>{query.forked_by.length || 0} Forks</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLikeClick}
              disabled={loading}
              className="hover:text-white"
            >
              {liked ? (
                <FaStar className="text-sm" />
              ) : (
                <FaRegStar className="text-sm" />
              )}
            </button>
            {/* this is likely wrong cause it wont reflect the right numbers when user unlike */}
            <span>{query.stared_by.length + (liked ? 1 : 0)} Stars</span>
          </div>
        </div>
      </div>

      <button type="button" onClick={handleQueryClick} className="mt-2 text-sm">
        <SyntaxHighlighter
          language="sql"
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            borderRadius: "0.5em",
            background: syntaxBg,
            borderWidth: 1,
            borderColor,
            overflowY: "hidden",
          }}
          wrapLines
          wrapLongLines
          showInlineLineNumbers
          showLineNumbers
          className="h-[10rem] rounded-none"
        >
          {`${query.query}\n\n\n\n\n\n\n\n\n`}
        </SyntaxHighlighter>
      </button>

      {/* Future update should make this a button so users can search other queries with same tags */}
      <div className="flex items-center justify-between mt-2">
        <div>
          {query.forked_from?.trim() && (
            <span className="dark:bg-[#1f1f1f] border border-orange-300 text-orange-200 px-2 rounded-full text-[11px] inline-block">
              Forked Query
            </span>
          )}
        </div>

        {query.tags && query.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-orange-500 dark:text-orange-300 justify-end">
            {query.tags.map((tag, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="dark:bg-[#1a1a1a] border dark:border-[#333] border-black/10 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
