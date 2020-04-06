import { useState, useEffect } from "react";

const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });
  return windowHeight;
};
export default useWindowHeight;
