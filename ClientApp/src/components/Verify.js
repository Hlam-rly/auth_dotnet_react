import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { breakpointsContext } from "../helpers/Context"

import { Row, Col, Result, Button, theme } from "antd"
import { ResultPage } from "antd-mobile"
import { useTimeout } from "ahooks"

const Verify = () =>
{
  const { token } = theme.useToken();
  const { size } = useContext(breakpointsContext);

  const navigate = useNavigate();

  const url = window.location.href;

  const accessToken = new URLSearchParams(url.split("#")[1]).get("access_token");

  const navigateMainPage = () => navigate("/");

  if (!accessToken)
  {
    navigateMainPage();
  }

  useTimeout(() =>
  {
    navigateMainPage();
  }, 5000);

  return (
    <>
      {accessToken &&
        size.sm
        ?
        <Row>
          <Col span={8} offset={8}>
            <Result status="success" title="Your Email address is verified!" subTitle="In 5 seconds you will be redirected to the main page..."
              extra={<Button type="primary" onClick={navigateMainPage} style={{ overflow: "hidden" }}>To the main page!</Button>} />
          </Col>
        </Row>
        :
        <>
          <ResultPage style={{ "--background-color": "#c1c48f", "--adm-color-box": token.colorBgLayout }} status="success" title="Your Email address is verified!" description="In 5 seconds you will be redirected to the main page..." secondaryButtonText="To the main page!" onSecondaryButtonClick={navigateMainPage}>
          </ResultPage>
          
        </>
        }
    </>
  )
}

export default Verify;