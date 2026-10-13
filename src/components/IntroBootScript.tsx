import { INTRO_STORAGE_KEY } from "@/lib/intro";

/**
 * Inline script that runs before React paints.
 * On the home page, if this session has not finished the intro, it marks
 * `<html data-intro="pending">` so CSS can hide the portfolio and avoid a flash.
 * A 12s timeout clears that flag if the intro component never takes over.
 */
export function IntroBootScript() {
  const bootScript = `(function(){try{var pathname=location.pathname;if(pathname!=="/"&&pathname!=="")return;if(sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)})==="1")return;document.documentElement.setAttribute("data-intro","pending");window.setTimeout(function(){if(document.documentElement.getAttribute("data-intro")==="pending"){document.documentElement.removeAttribute("data-intro");}},12000);}catch(error){}})();`;

  return (
    <script
      id="portfolio-intro-boot"
      dangerouslySetInnerHTML={{ __html: bootScript }}
    />
  );
}
