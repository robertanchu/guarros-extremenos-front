import React from "react";
import Meta from "../lib/Meta";
import HeroPlus from "@/components/HeroPlus";
import TrustBar from "@/components/TrustBar";
import FeaturedProducts from "@/components/FeaturedProducts";
import DehesaTeaser from "@/components/DehesaTeaser";
import Reviews from "@/components/Reviews";
import Marquee from "@/components/Marquee";
import ClubGuarro from "@/components/ClubGuarro";

export default function Home(){
  return (
    <>
      <Meta title="Jamón Ibérico 100% Bellota · D.O.P" />
      <HeroPlus />
      <TrustBar />
      <FeaturedProducts />
      <DehesaTeaser />
      <Reviews />
      <ClubGuarro />
      <Marquee />
    </>
  );
}
