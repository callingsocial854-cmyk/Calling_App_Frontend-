import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOffline, setOnline } from "../features/networkSlice";

const NetworkListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const goOnline = () => dispatch(setOnline());
    const goOffline = () => dispatch(setOffline());

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [dispatch]);

  return null;
};

export default NetworkListener;
