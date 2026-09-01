"use client";

import type { HomeLayoutProps } from "@/components/discover/home-layouts/types";
import {
  InspiredHome1,
  InspiredHome2,
  InspiredHome3,
  InspiredHome4,
  InspiredHome5,
} from "@/components/discover/home-layouts/HomePageSections";

export function HomeLayout1(props: HomeLayoutProps) {
  return <InspiredHome1 {...props} />;
}

export function HomeLayout2(props: HomeLayoutProps) {
  return <InspiredHome2 {...props} />;
}

export function HomeLayout3(props: HomeLayoutProps) {
  return <InspiredHome3 {...props} />;
}

export function HomeLayout4(props: HomeLayoutProps) {
  return <InspiredHome4 {...props} />;
}

export function HomeLayout5(props: HomeLayoutProps) {
  return <InspiredHome5 {...props} />;
}
