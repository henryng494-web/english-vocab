import {
  APP_THEMES,
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
} from "@/data/app-themes";

const themeVars = Object.fromEntries(
  Object.entries(APP_THEMES).map(([id, theme]) => [id, theme.cssVars]),
);

export const themeBootstrapScript = `(function(){try{var themes=${JSON.stringify(themeVars)};var key=${JSON.stringify(THEME_STORAGE_KEY)};var fallback=${JSON.stringify(DEFAULT_THEME_ID)};var id=localStorage.getItem(key)||fallback;var vars=themes[id]||themes[fallback];var root=document.documentElement;Object.keys(vars).forEach(function(k){root.style.setProperty(k,vars[k]);});root.dataset.theme=id;}catch(e){}})();`;
