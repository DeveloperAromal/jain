import { useState } from "react";

export function useFirstTimeTutorial() {
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false;

    const seenTutorial = localStorage.getItem("seenTutorial");
    if (!seenTutorial) {
      localStorage.setItem("seenTutorial", "true");
      return true;
    }
    return false;
  });

  return { showTutorial, setShowTutorial };
}
