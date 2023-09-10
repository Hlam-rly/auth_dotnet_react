import { useState, useEffect } from "react"

import { Row, Col, Typography, theme, Spin } from "antd"

import { useBoolean } from "ahooks";

import axios from "axios";

const User = ({ session }) =>
{
  const { token } = theme.useToken();

  const [loading, { setFalse, setTrue }] = useBoolean(false);

  const [id, setId] = useState("");
  const [description, setDescription] = useState("")
  const [nickname, setNickname] = useState("")

  const { Title, Paragraph } = Typography;

  const updateInfo = async (obj) =>
  {
    setTrue();

    const requestOptions =
    {
      method: "POST",
      url: "session/user/update/info",
      signal: AbortSignal.timeout(5000),
      data:
      {
        id: id,
        fieldName: obj.fieldName,
        fieldValue: obj.fieldValue
      }
    };

    const response = await axios.request(requestOptions);

    console.log(response)

    if (response.status === 200)
    {
      obj.setFunction(response.data[obj.fieldName]);
    }
    else
    {
      console.log(response.statusText);
    }

    setFalse();
  }

  useEffect(() =>
  {
    setId(session.id)
    setNickname(session.nickname);
    setDescription(session.description ?? "");
  }, [session.id, session.nickname, session.description]);

  return (
    <>
      <Row wrap={false}>
        <Col style={{ backgroundColor: token.colorPrimary, borderRadius: "4px" }} offset={8} span={8}>
          <Spin spinning={loading}>
            <Row wrap={false} gutter={[16, 16]} justify="center">
              <Col span={23}>
                <Title level={3}>Your profile:</Title>
                <Row wrap={false} >
              <Col span={24} style={{ display: "flex" }}>
                <Paragraph strong={true}>Nickname:&nbsp;</Paragraph>
                <Paragraph editable={{ maxLength: 20, onChange: (value) => updateInfo({ fieldName: "nickname", fieldValue: value, setFunction: (setValue) => setNickname(setValue) }), tooltip: false }}>{nickname}</Paragraph>
              </Col>
            </Row>

            <Row wrap={false}>
              <Col span={24}>
                <Paragraph strong={true}>About me:</Paragraph>
                <Paragraph editable={{ onChange: (value) => updateInfo({ fieldName: "description", fieldValue: value, setFunction: (setValue) => setDescription(setValue) }), tooltip: false }}>{description}</Paragraph>
              </Col>
                </Row>
              </Col>
            </Row>
          </Spin>
        </Col>
      </Row>
  </>)
}

export default User;
