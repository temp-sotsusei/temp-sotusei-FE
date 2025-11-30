"use client";

import { getAccessToken } from "@auth0/nextjs-auth0";
import { FC } from "react";

const Page: FC = () => {
  const getJWT = async () => {
    const token = await getAccessToken();
    console.log("accessToken:", token);
  };
  return (
    <button onClick={() => getJWT()} className="button p-4">
      clientSideJWT
    </button>
  );
};

export default Page;
