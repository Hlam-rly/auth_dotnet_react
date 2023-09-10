import { useContext } from "react";

import Auth from "./Auth";
import User from "./User";

import { sessionContext } from "../helpers/Context";

const Home = ({ activeForm}) =>
{
  const { session } = useContext(sessionContext)

  return (
    <>
      {
        session != null &&
        <>
          {
            session ?
              <User session={session} />
            : <Auth activeForm={activeForm} />
          }
        </>
      }
    </>
  );
}

export default Home