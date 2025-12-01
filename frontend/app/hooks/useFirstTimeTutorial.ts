import { useState, useEffect } from "react";

export function useFirstTimeTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seenTutorial = localStorage.getItem("seenTutorial");

    if (!seenTutorial) {
      setShowTutorial(true);
      localStorage.setItem("seenTutorial", "true");
    }
  }, []);
  return { showTutorial, setShowTutorial };
}
