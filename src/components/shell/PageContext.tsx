'use client';

import { useEffect } from "react";
import type { HeaderAction, HeaderNav } from "@/state/uiStore";
import { useUIStore } from "@/state/uiStore";

interface PageContextProps {
  nav?: HeaderNav;
  actions?: HeaderAction[];
}

export function PageContext({ nav, actions }: PageContextProps) {
  const setActiveNav = useUIStore((state) => state.setActiveNav);
  const setHeaderActions = useUIStore((state) => state.setHeaderActions);

  useEffect(() => {
    if (typeof nav !== "undefined") {
      setActiveNav(nav);
    }
    setHeaderActions(actions ?? []);

    return () => {
      if (typeof nav !== "undefined") {
        setActiveNav(null);
      }
      setHeaderActions([]);
    };
  }, [nav, actions, setActiveNav, setHeaderActions]);

  return null;
}
