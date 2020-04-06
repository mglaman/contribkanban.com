import { useState, useEffect } from "react";

const usePageTitle = () => {
  const [pageTitle, setPageTitle] = useState("ContribKanban");
  return pageTitle;
};
