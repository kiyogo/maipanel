import React, { useState } from 'react';
import { Table, Divider, Tag, Space, Select, CompactSelect } from '../custom-ui';

const LANGUAGE_OPTIONS = [
  { value: 'auto', label: 'Dò tìm tự động' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'am', label: 'አማርኛ' },
  { value: 'ar', label: 'العربية' },
  { value: 'bg', label: 'български' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'bs', label: 'bosanski' },
  { value: 'ca', label: 'català' },
  { value: 'cs', label: 'čeština' },
  { value: 'da', label: 'dansk' },
  { value: 'de', label: 'Deutsch' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'en', label: 'English (US)' },
  { value: 'en-la', label: 'español (Latinoamérica)' },
  { value: 'es', label: 'español (España)' },
  { value: 'et', label: 'eesti' },
  { value: 'eu', label: 'euskara' },
  { value: 'fa', label: 'فارسی' },
  { value: 'fi', label: 'suomi' },
  { value: 'fr-ca', label: 'français (Canada)' },
  { value: 'fr', label: 'français (France)' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'hr', label: 'hrvatski' },
  { value: 'hu', label: 'magyar' },
  { value: 'hy', label: 'հայերեն' },
  { value: 'id', label: 'Indonesia' },
  { value: 'is', label: 'íslenska' },
  { value: 'it', label: 'italiano' },
  { value: 'ja', label: '日本語' },
  { value: 'ka', label: 'ქართული' },
  { value: 'kk', label: 'қазақ тілі' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ko', label: '한국어' },
  { value: 'lt', label: 'lietuvių' },
  { value: 'lv', label: 'latviešu' },
  { value: 'mk', label: 'македонски' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'mn', label: 'монгол' },
  { value: 'mr', label: 'मराठी' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'my', label: 'မြန်မာ' },
  { value: 'nb', label: 'norsk bokmål' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
  { value: 'pl', label: 'polski' },
  { value: 'pt-br', label: 'português (Brasil)' },
  { value: 'pt', label: 'português (Portugal)' },
  { value: 'ro', label: 'română' },
  { value: 'ru', label: 'русский' },
  { value: 'sk', label: 'slovenčina' },
  { value: 'sl', label: 'slovenščina' },
  { value: 'so', label: 'Soomaali' },
  { value: 'sq', label: 'shqip' },
  { value: 'sr', label: 'српски' },
  { value: 'sv', label: 'svenska' },
  { value: 'sw', label: 'Kiswahili' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'th', label: 'ภาษาไทย' },
  { value: 'tl', label: 'Filipino' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'uk', label: 'українська' },
  { value: 'ur', label: 'اردو' },
  { value: 'uz', label: "o'zbek" },
  { value: 'zh-cn', label: '中文 (简体)' },
  { value: 'zh-tw', label: '中文 (繁體)' },
  { value: 'zu', label: 'isiZulu' },
];

const SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
  { value: '100', label: '100 / page' },
  { value: '200', label: '200 / page' },
  { value: '500', label: '500 / page' },
];

const TableDemo: React.FC = () => {
  const [lang, setLang] = useState('vi');
  const [pageSize, setPageSize] = useState('100');
  const [action, setAction] = useState('Xóa');

  // Table 1: Tags Table
  const columns1 = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text: string) => <a style={{ color: 'var(--antd-primary)', textDecoration: 'none' }}>{text}</a> },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map(tag => {
            let color = 'blue';
            if (tag === 'nice' || tag === 'cool') color = 'green';
            if (tag === 'kawaii') color = 'orange';
            return (
              <Tag color={color} key={tag} style={{ marginRight: 8, borderRadius: 4, textTransform: 'uppercase', fontWeight: 500 }}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a style={{ color: 'var(--antd-primary)', textDecoration: 'none', cursor: 'pointer' }}>Invite {record.name}</a>
          <a style={{ color: 'var(--antd-primary)', textDecoration: 'none', cursor: 'pointer' }}>Delete</a>
        </Space>
      ),
    },
  ];

  const data1 = [
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', tags: ['nice', 'developer'] },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', tags: ['kawaii'] },
    { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park', tags: ['cool', 'teacher'] },
  ];

  // Table 2: Sorting and Filtering Table
  const columns2 = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    {
      title: 'Gender', dataIndex: 'gender', key: 'gender',
      filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
      onFilter: (value: any, record: any) => record.gender === value,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  const data2 = [
    { key: '1', name: 'Mr. Greg Grimes', gender: 'female', email: 'Twila57@gmail.com' },
    { key: '2', name: 'Timothy Brakus', gender: 'female', email: 'Derek_Wyman@gmail.com' },
    { key: '3', name: 'Nicholas Feest', gender: 'female', email: 'Garrick.McKenzie@yahoo.com' },
    { key: '4', name: 'Ms. Ida Carroll', gender: 'female', email: 'Joshuah85@hotmail.com' },
    { key: '5', name: 'Aaron Satterfield', gender: 'female', email: 'Alan_Kuhlman@gmail.com' },
    { key: '6', name: 'Heidi Kris', gender: 'male', email: 'Dion.Mohr@yahoo.com' },
    { key: '7', name: 'Julio Schmeler', gender: 'male', email: 'Chaim_Nolan57@hotmail.com' },
    { key: '8', name: 'Heather Leuschke', gender: 'female', email: 'Sonia71@gmail.com' },
    { key: '9', name: 'Ben Lesch', gender: 'male', email: 'Allie_Friesen-Schmeler20@hotmail.com' },
    { key: '10', name: 'Harriet Hamill', gender: 'male', email: 'Dimitri85@gmail.com' },
  ];

  return (
    <div style={{ padding: '8px 12px', background: '#fff', minHeight: '100%' }}>

      {/* ===== Select Dropdown Demo ===== */}
      <Divider orientation="left">Select Dropdown Demo — Nhiều lựa chọn (không cuộn)</Divider>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start', padding: '8px 0 32px' }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>🌐 Chọn ngôn ngữ (70 mục)</div>
          <Select
            value={lang}
            onChange={setLang}
            options={LANGUAGE_OPTIONS}
            style={{ width: 220 }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Đang chọn: <b>{LANGUAGE_OPTIONS.find(o => o.value === lang)?.label}</b></div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>📄 Số dòng mỗi trang (6 mục)</div>
          <Select
            value={pageSize}
            onChange={setPageSize}
            options={SIZE_OPTIONS}
            style={{ width: 140 }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Đang chọn: <b>{SIZE_OPTIONS.find(o => o.value === pageSize)?.label}</b></div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>🔢 Select nhỏ (size=small)</div>
          <Select
            value={pageSize}
            onChange={setPageSize}
            options={SIZE_OPTIONS}
            size="small"
            style={{ width: 130 }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>⚙️ Select nhỏ (Thao tác đè giữa)</div>
          <Select
            value={action}
            onChange={setAction}
            options={[
              { value: 'Xóa', label: '🗑️ Xóa' },
              { value: 'Sao lưu', label: '☁️ Sao lưu' },
              { value: 'Tải lại', label: '🔄 Tải lại' }
            ]}
            size="small"
            style={{ width: 130 }}
          />
        </div>
      </div>

      {/* ===== Table 1 ===== */}
      <Divider orientation="left">Table with Tags</Divider>
      <Table columns={columns1} dataSource={data1} pagination={false} />

      <div style={{ margin: '32px 0' }} />

      {/* ===== Table 2 ===== */}
      <Divider orientation="left">Sorting and Filtering Table</Divider>
      <Table
        columns={columns2}
        dataSource={data2}
        pagination={{ pageSize: 10, current: 1, total: 100, showSizeChanger: true }}
      />
    </div>
  );
};

export default TableDemo;
