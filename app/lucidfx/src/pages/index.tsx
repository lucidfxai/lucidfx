import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>LucidFX AI</title>
        <meta name="description" content="LucidFX AI Video Super Resolution" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">LucidFX</span>.AI
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://replicate.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Replicate→</h3>
              <div className="text-lg">
                The future of ML deployments.
                Bundle your model into COG containers for trivial inference.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://upload.io/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Upload.io→</h3>
              <div className="text-lg">
                Upload.io is where we will upload our content to!
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://stripe.com/gb"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Stripe →</h3>
              <div className="text-lg">
                The best way to accept payments online.
                Integrate the payment processor.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://planetscale.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">PlanetScale→</h3>
              <div className="text-lg">
                Easy to use, scalable, cloud-native MySQL database as a service.
              </div>
            </Link>
          </div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <Link href="/protected" className="text-xl text-white">
            Log in with Clerk and check out a protected procedure.
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
