import Head from "next/head";

import { AxiosService } from "@/services/axios";
import { TabsSection } from "@/components/TabsSection";
import type { QueryResponse } from "@/types";
import Image from "next/image";

const axios = new AxiosService(process.env.NEXT_PUBLIC_API_URL!, false);

interface ExplorePageProps {
  searchParams: Promise<{
    tab?: "all" | "starred" | "forked";
    page?: string;
  }>;
}

async function getQueries(page = "1") {
  try {
    const data = await axios.get<QueryResponse>(
      `/api/query/?page=${page}&limit=10`
    );
    return { data, hasError: false };
  } catch (error) {
    console.error("Failed to fetch queries:", error);
    return { data: null, hasError: true };
  }
}

async function getStarredQueries(page = "1") {
  try {
    const data = await axios.get<QueryResponse>(
      `/api/query?type=stars&page=${page}&limit=10`
    );
    return { data, hasError: false };
  } catch (error) {
    console.error("Failed to fetch starred queries:", error);
    return { data: null, hasError: true };
  }
}

async function getForkedQueries(page = "1") {
  try {
    const data = await axios.get<QueryResponse>(
      `/api/query?type=forks&page=${page}&limit=10`
    );
    return { data, hasError: false };
  } catch (error) {
    console.error("Failed to fetch forked queries:", error);
    return { data: null, hasError: true };
  }
}

export default async function Explore({ searchParams }: ExplorePageProps) {
  const page = (await searchParams).page ?? "1";
  const defaultTab = (await searchParams).tab ?? "all";

  const [
    { data: allQueries, hasError: allError },
    { data: starredQueries, hasError: starredError },
    { data: forkedQueries, hasError: forkedError },
  ] = await Promise.all([
    getQueries(page),
    getStarredQueries(page),
    getForkedQueries(page),
  ]);

  const isAllEmpty = allError && starredError && forkedError;
  return (
    <div className="dark text-white min-h-[88vh]">
      <Head>
        <title>Explore</title>
      </Head>

      <div className="pt-10">
        {isAllEmpty ? (
          <div className="flex items-center justify-center flex-col text-white font-medium text-lg mt-16 px-3">
            <Image
              src="/img/nodata.svg"
              width={400}
              height={400}
              alt="no data"
            />
            <p className="mt-4">
              Something went wrong fetching queries. Try again
            </p>
          </div>
        ) : (
          <TabsSection
            queries={allQueries}
            starredQueries={starredQueries}
            forkedQueries={forkedQueries}
            defaultTab={defaultTab}
          />
        )}
      </div>
    </div>
  );
}
