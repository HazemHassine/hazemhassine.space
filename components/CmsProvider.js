"use client";

import { createContext, useContext, useMemo } from "react";
import {
  education,
  experience,
  navigation,
  projects,
  siteConfig,
  skills,
  techStack,
} from "@/lib/data";
import { skillCategories, skillsWithProvenance } from "@/lib/skillsData";
import { pageContentDefaults, themeDefaults, themeToCssVariables } from "@/lib/cms-shared";

const clientDefaults = {
  siteConfig,
  navigation,
  experience,
  education,
  projects,
  skills,
  skillsWithProvenance,
  skillCategories,
  techStack,
  pageContent: pageContentDefaults,
  theme: themeDefaults,
};

const CmsContext = createContext(clientDefaults);

export default function CmsProvider({ initialData, children }) {
  const value = useMemo(() => ({ ...clientDefaults, ...(initialData || {}) }), [initialData]);
  const themeStyle = themeToCssVariables({ ...themeDefaults, ...(value.theme || {}) });

  return (
    <CmsContext.Provider value={value}>
      <div className="contents" style={themeStyle}>{children}</div>
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}

