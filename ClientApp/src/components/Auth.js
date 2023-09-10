import { useRef, useEffect, useContext } from "react";
import { sessionContext, breakpointsContext, notificationContext } from "../helpers/Context";

import { useToggle, useBoolean } from "ahooks"

import { Button, Input, Form, Carousel, Row, Col, theme } from "antd";
import { Form as FormM, Input as InputM, Button as ButtonM, Grid } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons"

import axios from "axios";

const Auth = ({ activeForm }) =>
{
  const { token } = theme.useToken();

  const { setSession } = useContext(sessionContext);
  const { size } = useContext(breakpointsContext);
  const { api } = useContext(notificationContext);

  const [visible, { toggle }] = useToggle(false);
  const [loading,  setLoading] = useBoolean(false);
  const [regLoading, setRegLoading] = useBoolean(false);

  const carouselRef = useRef();
  const goTo = (index) => carouselRef.current?.goTo(index, false);

  const signIn = async (signInValues) =>
  {
    try
    {
      setLoading.setTrue();

      const requestOptions =
      {
        method: "POST",
        url: "signin",
        signal: AbortSignal.timeout(5000),
        data:
        {
          emailInput: signInValues.siEmail,
          passwordInput: signInValues.siPassword
        }
      };

      const response = await axios.request(requestOptions);

      if (response.status === 200)
      {
        setSession(response.data)
      }
    }
    catch (err)
    {
      console.log(err);
    }
    finally
    {
      setLoading.setFalse();
    }

    //console.log("Sign In Successful:")
    //console.log("Sign in email:", state.siEmail)
    //console.log("Sign in pass:", state.siPassword)
  }
  const signUp = async (signUpValues) =>
  {
    try
    {
      setRegLoading.setTrue();

      const requestOptions =
      {
        method: "POST",
        url: "signup",
        signal: AbortSignal.timeout(5000),
        data:
        {
          emailInput: signUpValues.regEmail,
          nicknameInput: signUpValues.regNickname,
          passwordInput: signUpValues.regPassword
        }
      };

      const response = await axios.request(requestOptions);

      if (response.status === 200)
      {
        signUpNotification("top");
      }
    }
    catch (err)
    {
      console.log(err)
    }
    finally
    {
      setRegLoading.setFalse();
    }
  }

  const signUpNotification = (placement) =>
  {
    api.info({
      message: "You are successfully registered!",
      description: <notificationContext.Consumer>{({ values }) => values.signUpMessage}</notificationContext.Consumer>,
      duration: 0,
      style: {width: 420},
      placement
    })
  }

  const validateMessages =
  {
    required: "${label} is a required field.",
    types:
    {
      email: "Invalid email format."
    },
    string:
    {
      min: "${label} must be at least ${min} characters."
      }
  };

  const mobileStyle = { "--background-color": token.colorPrimary, "--text-color": token.colorTextLightSolid };

  useEffect(() =>
  {
    goTo(activeForm);

  }, [activeForm])

  return (
    <>
      {
        size.sm ?
          <Carousel ref={carouselRef} dots={false} infinite={false} >
            <Row justify="center" align="middle">
              <Col offset="10" lg={{ span: "4" }} xs={{ span: "6" }}>
                <Form layout="vertical" requiredMark={false} onFinish={signIn}>
                  <Form.Item label="Email" name="siEmail" rules={[{ required: true, message: "Email is a required field." }, { type: "email" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Password" name="siPassword" rules={[{ required: true, message: 'Password is a required field.' }]}>
                    <Input.Password />
                  </Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit" block>Sign In</Button>
                </Form>
              </Col>
            </Row>

            <Row justify="center" align="middle">
              <Col offset="10" span="4">
                <Form layout="vertical" requiredMark={false} onFinish={signUp}>
                  <Form.Item label="Email" name="regEmail" rules={[{ required: true, message: "Email is a required field." }, { type: "email" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Nickname" name="regNickname" rules={[{ required: true, message: "Nickname is a required field." }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Password" name="regPassword" rules={[{ required: true, message: "Password is a required field." }]}>
                    <Input.Password />
                  </Form.Item>
                  <Button loading={regLoading} type="primary" htmlType="submit" block>Sign Up</Button>
                </Form>
              </Col>
            </Row>
          </Carousel >
          :
          <Carousel ref={carouselRef} dots={false} infinite={false} swipe={false}>
            <Grid columns={1} gap={2}>
              <Grid.Item span={1}>
                <FormM requiredMarkStyle="none" mode="card" layout={size.xs ? "vertical" : "horizontal"} onFinish={signIn} validateMessages={validateMessages}
                  footer=
                  {
                    <ButtonM loading={loading} style={mobileStyle} block type="submit" color="primary">Sign In</ButtonM>
                  }>
                  <FormM.Item label="Email" name="siEmail" rules={[{ required: true }, { type: "email" }]}>
                    <InputM />
                  </FormM.Item>
                  <FormM.Item label="Password" name="siPassword" rules={[{ required: true }, { type: "password" }]}
                    extra={
                      <div style={{ cursor: "pointer" }} onClick={toggle}>
                        {
                          visible
                            ? <EyeOutline fontSize={24} />
                            : <EyeInvisibleOutline fontSize={24} />
                        }
                      </div>}>
                    <InputM type={visible ? "text" : "password"} />
                  </FormM.Item>
                </FormM>
              </Grid.Item>
            </Grid>

            <Grid columns={1} gap={2}>
              <Grid.Item span={1}>
                <FormM mode="card" requiredMarkStyle="none" layout="vertical" onFinish={signUp} validateMessages={validateMessages}
                  footer=
                  {
                    <ButtonM loading={regLoading} style={mobileStyle} block type="submit" color="primary">Sign In</ButtonM>
                  }>
                  <FormM.Item label="Email" name="regEmail" rules={[{ required: true }, { type: "email" }]} minLenght="3">
                    <InputM />
                  </FormM.Item>
                  <FormM.Item label="Nickname" name="regNickname" rules={[{ required: true }, { type: "string", min: 3 }]}>
                    <InputM></InputM>
                  </FormM.Item>
                  <FormM.Item label="Password" name="regPassword" rules={[{ required: true }, { type: "password" }]}
                    extra={
                      <div style={{ cursor: "pointer" }} onClick={toggle}>
                        {
                          visible
                            ? <EyeOutline fontSize={24} />
                            : <EyeInvisibleOutline fontSize={24} />
                        }
                      </div>}>
                    <InputM type={visible ? "text" : "password"} />
                  </FormM.Item>
                </FormM>
              </Grid.Item>
            </Grid>
          </Carousel >
      }
    </>
  );
}

export default Auth;