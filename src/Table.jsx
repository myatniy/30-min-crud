import { useState } from "react";
import {
  Table as ATable,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
} from "antd";

const generateId = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};

const Demo = ({ setData }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
    setData((state) => state.concat({ key: generateId(), ...values }));
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Developer"
        name="developer"
        rules={[
          {
            required: true,
            message: "Please input your developer!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Publisher"
        name="publisher"
        rules={[
          {
            required: true,
            message: "Please input your publisher!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Genre"
        name="genre"
        rules={[
          {
            required: true,
            message: "Please input your genre!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Release"
        name="release"
        rules={[
          {
            required: true,
            message: "Please input your release!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Age"
        name="age"
        rules={[
          {
            required: true,
            message: "Please input your age!",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const originData = [
  {
    key: "1",
    name: "GTA 5",
    developer: "R*",
    publisher: "T/2",
    genre: "Action",
    release: "01-01-2012",
    age: "18",
  },
  {
    key: "2",
    name: "GTA 3",
    developer: "R*",
    publisher: "T/2",
    genre: "Sandbox",
    release: "02-02-2001",
    age: "18",
  },
  {
    key: "3",
    name: "GTA 4",
    developer: "R*",
    publisher: "T/2",
    genre: "3D",
    release: "03-03-2002",
    age: "18",
  },
];

const Table = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const deleteRecord = (id) => {
    setData((state) => {
      const tableDataIndexOfArr = state.findIndex((el) => el.key === id);
      return [
        ...state.slice(0, tableDataIndexOfArr),
        ...state.slice(tableDataIndexOfArr + 1),
      ];
    });
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      developer: "",
      publisher: "",
      genre: "",
      release: "",
      age: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Developer",
      dataIndex: "developer",
      key: "developer",
      editable: true,
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      key: "publisher",
      editable: true,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      editable: true,
    },
    {
      title: "Release",
      dataIndex: "release",
      key: "release",
      editable: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              style={{ marginRight: "0.5em" }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link onClick={() => deleteRecord(record.key)}>
              Delete
            </Typography.Link>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ width: "50%", margin: "1em auto" }}>
          <Demo setData={setData} />
        </div>
      </div>
      <Form form={form} component={false}>
        <ATable
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    </>
  );
};

export default Table;

// export default function Table() {
//   const [tableData, setTableData] = useState(data);

//   const deleteRecord = (id) => {
//     setTableData((state) => {
//       const tableDataIndexOfArr = state.findIndex((el) => el.key === id);
//       return [
//         ...state.slice(0, tableDataIndexOfArr),
//         ...state.slice(tableDataIndexOfArr + 1)
//       ];
//     });
//   }

//   const columns = [
//     {
//       title: 'Id',
//       dataIndex: 'key',
//       key: 'key',
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       render: text => <a>{text}</a>,
//     },
//     {
//       title: 'Developer',
//       dataIndex: 'developer',
//       key: 'developer',
//     },
//     {
//       title: 'Publisher',
//       dataIndex: 'publisher',
//       key: 'publisher',
//     },
//     {
//       title: 'Genre',
//       dataIndex: 'genre',
//       key: 'genre',
//     },
//     {
//       title: 'Release',
//       dataIndex: 'release',
//       key: 'release',
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (text, record) => (
//         <Space size="middle">
//           <a>Invite {record.name}</a>
//           <a onClick={() => deleteRecord(record.key)}>Delete</a>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <ATable columns={columns} dataSource={tableData} pagination={false} />
//     </>
//   )
// }
