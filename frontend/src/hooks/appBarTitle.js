import { useState } from "react";

function useAppBarTitle() {
  const [currentTitle, setTitle] = useState(null);
  function setAppBarTitle(title) {
    setTitle(title);
  }
  return [currentTitle, setAppBarTitle];
}
export default useAppBarTitle;
