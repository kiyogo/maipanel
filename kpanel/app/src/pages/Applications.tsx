import React, { useState } from 'react';
import { Row, Col, Card, Button, Tag, Typography, Space, Badge, Input } from '../custom-ui';
import { DownloadOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

type App = { key:string; name:string; desc:string; category:string; version:string; installed:boolean; };

const catalog: App[] = [
  {key:'1',  name:'Nginx',       desc:'apps.descNginx',     category:'apps.catWeb',      version:'1.25.3', installed:true  },
  {key:'2',  name:'Docker',      desc:'apps.descDocker',    category:'apps.catDevops',   version:'25.0.3', installed:true  },
  {key:'3',  name:'Git',         desc:'apps.descGit',       category:'apps.catDevops',   version:'2.43.0', installed:true  },
  {key:'4',  name:'Node.js',     desc:'apps.descNode',      category:'apps.catRuntime',  version:'20.11.0',installed:true  },
  {key:'5',  name:'PHP 8.3',     desc:'apps.descPhp',       category:'apps.catRuntime',  version:'8.3.0',  installed:false },
  {key:'6',  name:'Python 3.12', desc:'apps.descPython',    category:'apps.catRuntime',  version:'3.12.0', installed:false },
  {key:'7',  name:'MySQL 8',     desc:'apps.descMysql',     category:'apps.catDatabase', version:'8.0.36', installed:false },
  {key:'8',  name:'Redis',       desc:'apps.descRedis',     category:'apps.catDatabase', version:'7.2.4',  installed:true  },
  {key:'9',  name:'Certbot',     desc:'apps.descCertbot',    category:'apps.catSecurity', version:'2.9.0',  installed:true  },
  {key:'10', name:'Fail2Ban',    desc:'apps.descFail2ban',   category:'apps.catSecurity', version:'1.0.2',  installed:true  },
  {key:'11', name:'Prometheus',  desc:'apps.descPrometheus', category:'apps.catMonitor',  version:'2.50.1', installed:false },
  {key:'12', name:'Grafana',     desc:'apps.descGrafana',    category:'apps.catMonitor',  version:'10.3.3', installed:false },
];

const catColors: Record<string,string> = {
  'apps.catWeb':'blue', 'apps.catDevops':'purple', 'apps.catRuntime':'green', 'apps.catDatabase':'orange', 'apps.catSecurity':'red', 'apps.catMonitor':'cyan',
};

const Applications: React.FC = () => {
  const { t } = useLanguage();
  const [apps, setApps] = useState(catalog);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');

  const categories = Array.from(new Set(catalog.map(a=>a.category)));
  const filtered = apps.filter(a=>{
    const ms = !search || a.name.toLowerCase().includes(search.toLowerCase());
    const mc = !cat    || a.category===cat;
    return ms && mc;
  });

  const toggle = (key:string) => setApps(p=>p.map(a=>a.key===key?{...a,installed:!a.installed}:a));

  return (
    <div>
      <Space style={{marginBottom:20,flexWrap:'wrap'}}>
        <Input prefix={<SearchOutlined/>} placeholder={t('apps.searchPlaceholder')} value={search}
          onChange={e=>setSearch(e.target.value)} style={{width:200}}/>
        {['', ...categories].map(c=>(
          <Tag key={c||'all'} color={cat===c&&c?catColors[c]:undefined}
            onClick={()=>setCat(cat===c?'':c)}
            style={{
              padding:'4px 12px',borderRadius:4,cursor:'pointer',
              background:cat===c&&!c?'#009688':undefined,
              color:cat===c&&!c?'#fff':undefined,
            }}>
            {c ? t(c) : t('apps.tagAll')}
          </Tag>
        ))}
      </Space>

      <Row gutter={[16,16]}>
        {filtered.map(app=>(
          <Col xs={24} sm={12} lg={8} xl={6} key={app.key}>
            <Card size="small" style={{height:'100%'}}
              actions={[
                <Button key="i" type={app.installed?'default':'primary'} size="small"
                  icon={app.installed?<CheckOutlined/>:<DownloadOutlined/>}
                  onClick={()=>toggle(app.key)} style={{width:'90%'}}>
                  {app.installed?t('apps.btnInstalled'):t('apps.btnInstall')}
                </Button>
              ]}
            >
              <Space direction="vertical" size={4} style={{width:'100%'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <Text strong style={{fontSize:14}}>{app.name}</Text>
                  <Badge status={app.installed?'success':'default'}/>
                </div>
                <Tag color={catColors[app.category]} style={{borderRadius:4,fontSize:11}}>{t(app.category)}</Tag>
                <Text style={{color:'#757575',fontSize:12,lineHeight:1.4}}>{t(app.desc)}</Text>
                <Text style={{color:'#bbb',fontSize:11}}>v{app.version}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Applications;
