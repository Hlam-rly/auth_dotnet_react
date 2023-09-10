import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from "react"

import Home from './components/Home';
import Verify from './components/Verify';
import WebsiteLayout from './components/WebsiteLayout';

import { sessionContext, breakpointsContext, notificationContext } from "./helpers/Context";
import useSession from './helpers/useSession';

import { ConfigProvider, theme, notification } from "antd"
import { useResponsive } from "ahooks"

import "antd/dist/reset.css";
import './index.scss';

const App = () =>
{
  const [formIndex, setFormIndex] = useState(0);

  const size = useResponsive();

  const { session, setSession } = useSession();

  const [api, contextHolder] = notification.useNotification();

  useEffect(() =>
  {
    console.log(session);
  },[session])

  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm, token: { colorPrimary: "#fcff9c", colorTextLightSolid: "#424242", colorBgLayout: "#434343" }}}>
      <sessionContext.Provider value={{ session, setSession }}>
        <breakpointsContext.Provider value={{ size }}>
          <notificationContext.Provider value={{ api, values: { signUpMessage: "Please check your email, a message with confirmation link was sent to your email address. " } }}>
            <WebsiteLayout setFormIndex={setFormIndex}>
              {contextHolder}
              <Routes>
                <Route key={"index"} index={true} element={<Home activeForm={formIndex} setFormIndex={setFormIndex} />} />
                <Route path={"/verify"} key={"verify"} element={<Verify />} />
              </Routes>

            </WebsiteLayout>
          </notificationContext.Provider>
        </breakpointsContext.Provider>
      </sessionContext.Provider>
    </ConfigProvider>
  );
}

export default App;
