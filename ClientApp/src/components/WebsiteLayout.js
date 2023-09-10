import {useLocation } from "react-router-dom"
import { useContext, useEffect } from "react"
import { breakpointsContext, sessionContext } from "../helpers/Context";

import { useBoolean } from "ahooks";

import { Layout, Tabs, Row, ConfigProvider, Button } from "antd"

import axios from "axios";

const WebsiteLayout = ({ setFormIndex, children }) =>
{
  const { Header, Content } = Layout;

  const menuItems =
  [
    {
      label: "Sign In",
      key: "0",
    },
    {
      label: "Sign Up",
      key: "1"
    },
    ];

  const { size } = useContext(breakpointsContext);
  const { session, setSession } = useContext(sessionContext);

  const [isIndexPage, setIsIndexPage] = useBoolean(true);

  const [loading, { setFalse, setTrue }] = useBoolean(false);

  const signOut = async () =>
  {
    setTrue();

    const requestOptions =
    {
      method: "POST",
      url: "signout",
      signal: AbortSignal.timeout(5000)
    };

    const response = await axios.request(requestOptions);

    if (response.status === 200)
    {
      setSession("");
    }

    setFalse();
  };

  const location = useLocation();

  useEffect(() =>
  {
    setIsIndexPage.set(location.pathname === "/" || location.pathname.length === 0);
  }, [location, setIsIndexPage])

  return (
    <Layout>
      <ConfigProvider theme={{ components: { Layout: { colorBgHeader: "transparent", colorBgBody: "#ffffff" } }, token: { colorLink: "#fcff9c" } }}>
        {isIndexPage &&
          <Header >
            <Row align="middle" style={size.md ? { flexFlow: "row-reverse wrap", height: "100%" } : { justifyContent: "center", height: "100%" }} >
              {
                session
                ?
                  <Button loading={loading} onClick={signOut} type="link">Sign out</Button>
                :
                  <Tabs defaultActiveKey="0" onChange={(key) => setFormIndex(key)} items={menuItems} animated={true} centered tabBarStyle={{ backgroundColor: "transparent", border: 0 }}></Tabs>
              }
            </Row>

          </Header>
        }
      </ConfigProvider>

      <Content style={{ display: "flex", flexDirection: "column", justifyContent: "center", overflowX: "hidden", maxWidth: "100vw" }}>
        {children}
      </Content>
    </Layout>
  )
}

export default WebsiteLayout