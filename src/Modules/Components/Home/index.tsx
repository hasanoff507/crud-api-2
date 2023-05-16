import React, { useEffect, useState } from 'react';
import { Table, Divider, Tag } from 'antd';
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
type Props = {};

const Home: React.FC<Props> = ({ }: Props) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
const [empData,setEmpdata]= useState()
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: 'Object Type',
      dataIndex: 'object Type',
      key: 'object Type',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Display Name',
        dataIndex: 'displayName',
        key: 'displayName',
    },
    {
      title: 'Pyton File Name',
      dataIndex: 'Pyton File Name',
      key: 'Pyton File Name',
    },
  ];
//   const columns = [
//     {
//         title: 'Name',
//         dataIndex: 'name',
//         key: 'name',
//     },
//     {
//         title: 'Display Name',
//         dataIndex: 'displayName',
//         key: 'displayName',
//     },
//     // ... other columns
// ];


  useEffect(() => {
    fetch("http://localhost:9020/Transforms/all" )
        .then((res) => {
            return res.json()
        })
        .then((resp) => {
            setEmpdata(resp);
        }).catch((err) => {
            console.log(err.message);
        })
}, [])


  return (
    <div>
      <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
        <h2>Transforms</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: "15px"
        }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item name="Search">
              <Input style={{
                width: 500,
              }} />
            </Form.Item>
          </Form>
          <div onClick={showModal} style={{
            background: '#3B3573',
            padding: '6px 9px 6px 9px',
            borderRadius: '4px',
          }}>
            <PlusOutlined />
          </div>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="displayName"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="fileName"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <Table columns={columns} dataSource={empData}/>
    </div>
  );
};

export default Home;
