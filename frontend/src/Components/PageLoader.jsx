import { useThemeStore } from "../Store/useThemeStore.js";

const PageLoader = () => {
  const {theme} = useThemeStore()
  return (
    <div className="flex justify-center items-center h-screen" data-theme={theme}>
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

export default PageLoader;
