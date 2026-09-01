"use client";

import { useSyncExternalStore } from "react";
import {
  HomeLayout1,
  HomeLayout2,
  HomeLayout3,
  HomeLayout4,
  HomeLayout5,
} from "@/components/discover/home-layouts/HomeLayoutVariants";
import type { HomeLayoutProps, HomeLayoutVariant } from "@/components/discover/home-layouts/types";
import {
  getDefaultHomeLayoutVariant,
  readHomeLayoutVariant,
  subscribeHomeLayout,
} from "@/lib/home-layout-preference";

const LAYOUTS: Record<
  HomeLayoutVariant,
  (props: HomeLayoutProps) => React.JSX.Element
> = {
  "1": HomeLayout1,
  "2": HomeLayout2,
  "3": HomeLayout3,
  "4": HomeLayout4,
  "5": HomeLayout5,
};

export function HomeLayoutRenderer(props: HomeLayoutProps) {
  const variant = useSyncExternalStore(
    subscribeHomeLayout,
    readHomeLayoutVariant,
    getDefaultHomeLayoutVariant,
  );
  const Layout = LAYOUTS[variant] ?? HomeLayout1;
  return <Layout {...props} variant={variant} />;
}
