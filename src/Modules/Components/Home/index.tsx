import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { CheckCircleOutlined } from '@ant-design/icons';
import { CaretRightOutlined } from '@ant-design/icons';
import EditIcon from '@mui/icons-material/Edit';
import { DeleteFilled } from '@ant-design/icons';
type Props = {};

const Home: React.FC<Props> = ({ }: Props) => {
  const { Option } = Select;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empData, setEmpdata] = useState()
  const [entity, setEntety] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState(null)
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
      dataIndex: 'command',
      key: 'command',
    },
    {
      title: 'Edit',
      dataIndex: 'Edit',
      key: 'Edit',
      render: (text: any, record: any) => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="edit__icons">
            <CaretRightOutlined style={{ color: 'blue', fontSize: "30px" }} />
          </button>
          <button className="edit__icons">
            <EditIcon sx={{ color: 'orange' }} />
          </button>
          <button className="edit__icons" onClick={() => handleDelete(record.id)}>
            <DeleteFilled style={{ color: 'red', fontSize: "30px" }} />
          </button>
        </div>
      ),
    },

  ];
  const handleDelete = (id: string) => {
    if (window.confirm('Do you want to remove?')) {
      fetch(`http://localhost:9020/Transforms/${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            // Successful response
            alert('Removed successfully.');
            // Perform any necessary actions after successful deletion
          } else {
            // Handle error response
            throw new Error('Failed to delete data.');
          }
        })
        .catch((error) => {
          console.log('Error deleting data:', error);
          // Handle the error, show an error message, etc.
        });
    }
  };
  
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
    fetch("http://localhost:9020/Transforms", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    })
      .then((res) => {
        if (res.ok) {
          // Successful response
          return res.json();
        } else {
          // Handle error response
          throw new Error("Failed to save data.");
        }
      })
      .then((data) => {
        // Handle the response data
        console.log("Data saved successfully:", data);
        // Update the empData state or perform any other necessary actions
      })
      .catch((error) => {
        console.log("Error saving data:", error);
        // Handle the error, show an error message, etc.
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    fetch("http://localhost:9020/Transforms/all")
      .then((res) => {
        return res.json()
      })
      .then((resp) => {
        setEmpdata(resp);
      }).catch((err) => {
        console.log(err.message);
      })
  }, [])

  useEffect(() => {
    fetch("http://localhost:9020/Ontology/ObjectTypes")
      .then((res) => {
        return res.json()
      })
      .then((resp) => {
        setEntety(resp);
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
          <Modal title="Create Transform" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                name="entity"
                rules={[{ required: true, message: 'Entity' }]}
              >
                <Select
                  placeholder='Entity'
                  style={{ width: 470 }}
                  onChange={handleChange}
                >
                  {entity &&
                    entity.map((e: any) => (
                      <Option key={e.objectId} value={e.name}>
                        {e.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder='Name' style={{ width: '150%' }} />
              </Form.Item>

              <Form.Item
                name="displayName"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input placeholder='Display Name' style={{ width: '150%' }} />
              </Form.Item>
              <Form.Item
                name="fileName"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input placeholder='File Name' style={{ width: '150%' }} />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" style={{ position: 'absolute', right: '0' }}>
                  Submit
                </Button>
                <Button type="link" onClick={handleCancel} htmlType="submit" style={{ position: 'absolute', right: '100px', color: 'blue' }}>
                  Cansel
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <Table columns={columns}  />
    </div>
  );
};

export default Home;
