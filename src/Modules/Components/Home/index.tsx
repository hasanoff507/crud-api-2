import React, { useEffect, useState } from 'react';
import { Urls } from '../../../Api';
import { Button, Checkbox, Form, Input, Modal, Select, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { CheckCircleOutlined } from '@ant-design/icons';
import { CaretRightOutlined } from '@ant-design/icons';
import EditIcon from '@mui/icons-material/Edit';
import { DeleteFilled } from '@ant-design/icons';
type Props = {

};

interface EmployeeData {
  id: number;
  objectType: string;
  name: string;
  displayName: string;
  command: string;
  objectTypeId:string
}
interface ObjectType {
  objectId: string;
  name: string;
}
const Home: React.FC<Props> = ({ }: Props) => {
  const { Option } = Select;

  //Modal Open and Close
  const [isModalOpen, setIsModalOpen] = useState(false);
  //Post and Get data
  const [empData, setEmpdata] = useState<any[]>([]);
  //Object Type Name Option
  const [entity, setEntety] = useState<any[]>([])
  //Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  //Get Table Object Type
  const [objectTypeTable, setObjectTypeTable] = useState<ObjectType[]>([]);
  //Post Exute Data
  const [exutePostData, setExutePostData] = useState(false);
  //Exute
  const [exutePost, setExuteData] = useState();
  const [exuteId, setExuteId] = useState<any>();

console.log(empData);

  // delete function is running
  const handleDelete = (id: string) => {
    if (window.confirm('Do you want to remove?')) {
      fetch(`${Urls}/Transforms/id/${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            // Successful response
            alert('Removed successfully.');
            // Reload the page
            window.location.reload();
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
  //Post Data
  const onFinish = (values: any) => {
    const payload = {
      name: values.name,
      displayName: values.displayName,
      objectType: values.entity,
      command: values.fileName
    };

    fetch(`${Urls}/Transforms`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to save data.");
        }
      })
      .then((data) => {
        console.log("Data saved successfully:", data);
        handleCancel(); // Close the modal
        setEmpdata(prevData => [...prevData, data]);
        window.location.reload();
      })
      .catch((error) => {
        console.log("Error saving data:", error);
      });
  };
  //Edit Data
  const onFinishEdit = (values: any) => {
    const payload = {
      name: values.name,
      displayName: values.displayName,
      objectType: values.entity,
      command: values.fileName
    };

    fetch(`${Urls}/Transforms`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to save data.");
        }
      })
      .then((data) => {
        console.log("Data saved successfully:", data);
        handleCancel(); // Close the modal
        setEmpdata(prevData => [...prevData, data]);
        window.location.reload();
      })
      .catch((error) => {
        console.log("Error saving data:", error);
      });
  };
//Exute Data
const onExuteDataFinish = (values: any) => {
  const payload = {
    name: values.name,
    objectId: exuteId
  };



  fetch(`${Urls}/Transforms/execute`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to save data.");
      }
    })
    .then((data) => {
      console.log("Data saved successfully:", data);
      handleCancel(); // Close the modal
      setExuteData(data);
      // window.location.reload();
    })
    .catch((error) => {
      console.log("Error saving data:", error);
    });
};
  // Get All Transforms
  useEffect(() => {
    fetch(`${Urls}/Transforms/all`)
      .then((res) => {
        return res.json()
      })
      .then((resp) => {
        setEmpdata(resp);
      }).catch((err) => {
        console.log(err.message);
      })
  }, [])
  // Get Object Types Table
  useEffect(() => {
    fetch("http://localhost:9020/Object/get-object-type/e6029540-39df-4b30-8de9-771587372578")
      .then((res) => {
        return res.json()
      })
      .then((resp) => {
        setObjectTypeTable(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  //GetObject Types
  useEffect(() => {
    fetch(`${Urls}/Ontology/ObjectTypes`)
      .then((res) => {
        return res.json()
      })
      .then((resp) => {
        setEntety(resp);
      }).catch((err) => {
        console.log(err.message);
      })
  }, [])


  const columns = [
    {
      title: 'Object Type',
      dataIndex: 'objectType',
      key: 'objectType',
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
          <button className="edit__icons" onClick={()=>showExutedata(record.objectTypeId)}>
            <CaretRightOutlined style={{ color: 'blue', fontSize: "30px" }} />
          </button>
          <Modal title="Exucute Transform" open={exutePostData} onOk={handleExuteDataOk} onCancel={handleExuteCancel}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onExuteDataFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder='Name' style={{ width: '150%' }} />
              </Form.Item>

              {/* <Form.Item
                name="displayName"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input placeholder='Display Name' style={{ width: '150%' }} />
              </Form.Item> */}
              <h5 style={{ fontFamily: 'Roboto', fontSize: '14px', color: 'red' }}>File Name can be without file extension . File name is case sensitive</h5>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" style={{ position: 'absolute', right: '0' }}>
                  Exucute
                </Button>
                <Button type="link" onClick={handleEditCancel} style={{ position: 'absolute', right: '100px', color: 'blue' }}>
                  Cansel
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <button className="edit__icons" onClick={showEditModal}>
            <EditIcon sx={{ color: 'orange' }} />
          </button>
          <Modal title="Edit Transform" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinishEdit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
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
              <h5 style={{ fontFamily: 'Roboto', fontSize: '14px', color: 'red' }}>File Name can be without file extension . File name is case sensitive</h5>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" style={{ position: 'absolute', right: '0' }}>
                  Edit
                </Button>
                <Button type="link" onClick={handleEditCancel} style={{ position: 'absolute', right: '100px', color: 'blue' }}>
                  Cansel
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <button className="edit__icons" onClick={() => handleDelete(record.id)}>
            <DeleteFilled style={{ color: 'red', fontSize: "30px" }} />
          </button>
        </div>
      ),
    },

  ];

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };
  const handleEditOk = () => {
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
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

  const showExutedata = (id:any) => {
    setExuteId(id)
    console.log(id);
    
    setExutePostData(true)
  }
  const handleExuteDataOk = () => {
    setExutePostData(false);
  };

  const handleExuteCancel = () => {
    setExutePostData(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };


  return (
    <div>
      <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
        <h2>Transforms</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: "15px"
        }}>
          <input type="search" style={{ padding: '7px', width: '500px' }} />
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
              <h5 style={{ fontFamily: 'Roboto', fontSize: '14px', color: 'red' }}>File Name can be without file extension . File name is case sensitive</h5>
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
      <Table columns={columns} dataSource={empData} rowKey='id' />
    </div>
  );
};

export default Home;
