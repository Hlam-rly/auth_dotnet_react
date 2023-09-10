import {useEffect, useState} from "react"

import axios from "axios"

const useSession = () =>
{
  const [session, setSession] = useState(null);

  useEffect(() =>
  {
    const getSession = async () =>
    {
      //let response = await axios.get("https://localhost:44404/session");
      let response = await axios.get(`/session`);

      response.data?.accessToken ? setSession(response.data) : setSession("");
    }

    getSession();
  }, [])

  return { session, setSession };
}

export default useSession;