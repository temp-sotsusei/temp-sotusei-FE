import { NextResponse } from "next/server";
import { setTimeout } from "node:timers/promises";

export async function POST(request: Request) {
  // await setTimeout(1000);
  return NextResponse.json([
    ["うえさか1", "うえさか2", "うえさか3", "うえさか4"],
    ["うえさか5", "うえさか6", "うえさか7", "うえさか8"],
    ["うえさか9", "うえさか10", "うえさか11", "げんしりょくあんぜんいいんかい"],
  ]);
}
