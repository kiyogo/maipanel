import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Card, Row, Col, Badge, message, Popconfirm, Spin, Tooltip, Tabs, Divider, Upload, Switch, InputNumber, DatePicker, Checkbox } from '../custom-ui';
import { PlusOutlined, DeleteOutlined, RocketOutlined, GithubOutlined, EditOutlined, EyeOutlined, HistoryOutlined, ExportOutlined, SearchOutlined, FilterOutlined, DownloadOutlined, CopyOutlined, StopOutlined, PlayCircleOutlined, SettingOutlined, FileTextOutlined, SecurityScanOutlined, MonitorOutlined, CloudUploadOutlined, DatabaseOutlined, NodeIndexOutlined, CodeOutlined, BugOutlined, SaveOutlined, ControlOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { KTable } from '../components/KTable';
import { projectsApi, serversApi } from '../api/endpoints';
import { useLanguage } from '../context/LanguageContext';

import DomainSslConfig from '../components/ProjectSettings/DomainSslConfig';
import GitConfig from '../components/ProjectSettings/GitConfig';
import EnvConfig from '../components/ProjectSettings/EnvConfig';
import LogViewer from '../components/ProjectSettings/LogViewer';
import PhpConfig from '../components/ProjectSettings/PhpConfig';
import ComposerManager from '../components/ProjectSettings/ComposerManager';
import NodePm2Config from '../components/ProjectSettings/NodePm2Config';
import PythonWsgiConfig from '../components/ProjectSettings/PythonWsgiConfig';
import CronManager from '../components/ProjectSettings/CronManager';
import BackupRestore from '../components/ProjectSettings/BackupRestore';
import Monitoring from '../components/ProjectSettings/Monitoring';
import FilesManager from '../components/ProjectSettings/FilesManager';
import DeployManager from '../components/ProjectSettings/DeployManager';
import RedisCacheConfig from '../components/ProjectSettings/RedisCacheConfig';
import SecurityConfig from '../components/ProjectSettings/SecurityConfig';
import GameServerConfig from '../components/ProjectSettings/GameServerConfig';
import AiDataConfig from '../components/ProjectSettings/AiDataConfig';
import DockerManager from '../components/ProjectSettings/DockerManager';
import MiscSettings from '../components/ProjectSettings/MiscSettings';

const { Title, Text } = Typography;

type ProjectType = 'web-php' | 'web-nodejs' | 'web-proxy' | 'web-go' | 'web-python' | 'game' | 'app' | 'data' | 'api' | 'docker' | 'static' | 'java' | 'rust' | 'other';

const typeToSlugMap: Record<ProjectType, string> = {
  'web-php': 'web-php',
  'web-nodejs': 'web-nodejs',
  'web-proxy': 'reverse-proxy',
  'web-go': 'web-go',
  'web-python': 'web-python',
  'game': 'game-server',
  'app': 'application',
  'data': 'ai-data',
  'api': 'api-service',
  'docker': 'docker',
  'static': 'static-site',
  'java': 'java-spring',
  'rust': 'rust',
  'other': 'other'
};

const slugToTypeMap: Record<string, ProjectType> = {
  'web-php': 'web-php',
  'web-nodejs': 'web-nodejs',
  'web-proxy': 'web-proxy',
  'reverse-proxy': 'web-proxy',
  'web-go': 'web-go',
  'web-python': 'web-python',
  'game': 'game',
  'game-server': 'game',
  'app': 'app',
  'application': 'app',
  'data': 'data',
  'ai-data': 'data',
  'api': 'api',
  'api-service': 'api',
  'docker': 'docker',
  'static': 'static',
  'static-site': 'static',
  'java': 'java',
  'java-spring': 'java',
  'rust': 'rust',
  'other': 'other'
};

const typeMap: Record<ProjectType, { label: string; color: string }> = {
  'web-php': { label: 'Web PHP', color: 'blue' },
  'web-nodejs': { label: 'Web Node.js', color: 'green' },
  'web-proxy': { label: 'Reverse Proxy', color: 'orange' },
  'web-go': { label: 'Web Go', color: 'cyan' },
  'web-python': { label: 'Web Python', color: 'purple' },
  game: { label: 'Game Server', color: 'volcano' },
  app: { label: 'Application', color: 'geekblue' },
  data: { label: 'AI / Data', color: 'magenta' },
  api: { label: 'API Service', color: 'gold' },
  docker: { label: 'Docker', color: 'lime' },
  static: { label: 'Static Site', color: 'default' },
  java: { label: 'Java / Spring', color: 'red' },
  rust: { label: 'Rust', color: '#B7410E' },
  other: { label: 'Other', color: 'default' },
};

const projectTypes = Object.entries(typeMap).map(([key, val]) => ({
  key: key as ProjectType,
  label: val.label,
}));

const commonFields = [
  { name: 'name', label: 'Name', rules: [{ required: true, message: 'Required' }], component: <Input placeholder="my-project" /> },
  { name: 'domain', label: 'Domain', rules: [], component: <Input placeholder="example.com" /> },
  { name: 'git', label: 'Git URL', rules: [], component: <Input placeholder="https://github.com/..." /> },
  { name: 'description', label: 'Description', rules: [], component: <Input.TextArea rows={2} /> },
];

const phpFields = [
  ...commonFields,
  { name: 'phpVersion', label: 'PHP Version', rules: [], component: <Select options={[{ label: '8.3', value: '8.3' }, { label: '8.2', value: '8.2' }, { label: '8.1', value: '8.1' }, { label: '7.4', value: '7.4' }]} placeholder="8.3" /> },
  { name: 'webRoot', label: 'Web Root', rules: [], component: <Input placeholder="/public" /> },
];
const nodeFields = [
  ...commonFields,
  { name: 'nodeVersion', label: 'Node Version', rules: [], component: <Select options={[{ label: '20', value: '20' }, { label: '18', value: '18' }, { label: '16', value: '16' }]} placeholder="20" /> },
  { name: 'startCommand', label: 'Start Command', rules: [], component: <Input placeholder="npm start" /> },
  { name: 'port', label: 'Port', rules: [], component: <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="3000" /> },
];
const proxyFields = [
  ...commonFields,
  { name: 'upstreamUrl', label: 'Upstream URL', rules: [{ required: true, message: 'Required' }], component: <Input placeholder="http://127.0.0.1:8080" /> },
  { name: 'enableCache', label: 'Enable Cache', rules: [], component: <Switch /> },
];
const goFields = [
  ...commonFields,
  { name: 'goVersion', label: 'Go Version', rules: [], component: <Input placeholder="1.22" /> },
  { name: 'port', label: 'Port', rules: [], component: <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="8080" /> },
];
const pythonFields = [
  ...commonFields,
  { name: 'pythonVersion', label: 'Python Version', rules: [], component: <Select options={[{ label: '3.12', value: '3.12' }, { label: '3.11', value: '3.11' }, { label: '3.10', value: '3.10' }]} placeholder="3.12" /> },
  { name: 'framework', label: 'Framework', rules: [], component: <Select options={[{ label: 'Django', value: 'django' }, { label: 'Flask', value: 'flask' }, { label: 'FastAPI', value: 'fastapi' }]} placeholder="FastAPI" /> },
  { name: 'port', label: 'Port', rules: [], component: <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="8000" /> },
];
const gameFields = [
  ...commonFields,
  { name: 'gameEngine', label: 'Game Engine', rules: [], component: <Select options={[{ label: 'Minecraft', value: 'minecraft' }, { label: 'FiveM', value: 'fivem' }, { label: 'CS2', value: 'cs2' }, { label: 'Rust', value: 'rust-game' }, { label: 'ARK', value: 'ark' }]} placeholder="Minecraft" /> },
  { name: 'maxPlayers', label: 'Max Players', rules: [], component: <InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="50" /> },
  { name: 'port', label: 'Port', rules: [], component: <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="25565" /> },
];
const dockerFields = [
  ...commonFields,
  { name: 'image', label: 'Docker Image', rules: [{ required: true, message: 'Required' }], component: <Input placeholder="nginx:latest" /> },
  { name: 'port', label: 'Port', rules: [], component: <Input placeholder="80:80" /> },
  { name: 'volumes', label: 'Volumes', rules: [], component: <Input placeholder="/data:/data" /> },
];
const javaFields = [
  ...commonFields,
  { name: 'javaVersion', label: 'Java Version', rules: [], component: <Select options={[{ label: '21', value: '21' }, { label: '17', value: '17' }, { label: '11', value: '11' }]} placeholder="21" /> },
  { name: 'buildTool', label: 'Build Tool', rules: [], component: <Select options={[{ label: 'Maven', value: 'maven' }, { label: 'Gradle', value: 'gradle' }]} placeholder="Maven" /> },
  { name: 'port', label: 'Port', rules: [], component: <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="8080" /> },
];
const rustFields = [
  ...commonFields,
  { name: 'port', label: 'Port', rules: [], component: <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="8080" /> },
];
const otherFields = commonFields;

const createFieldConfig: Record<string, typeof commonFields> = {
  'web-php': phpFields, 'web-nodejs': nodeFields, 'web-proxy': proxyFields,
  'web-go': goFields, 'web-python': pythonFields, game: gameFields,
  docker: dockerFields, java: javaFields, rust: rustFields,
};

interface ProjectData {
  id: string; name: string; domain?: string; git?: string; type: ProjectType; server: string;
  status: 'running' | 'stopped'; createdAt: string; description?: string;
}

const editTabsConfig: Record<string, string[]> = {
  'web-php': ['overview', 'domain', 'ssl', 'git', 'env', 'php', 'composer', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
  'web-nodejs': ['overview', 'domain', 'ssl', 'git', 'env', 'pm2', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
  'web-proxy': ['overview', 'domain', 'ssl', 'env', 'cache', 'security', 'access', 'monitor'],
  'web-go': ['overview', 'domain', 'ssl', 'git', 'env', 'goVersion', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
  'web-python': ['overview', 'domain', 'ssl', 'git', 'env', 'gunicorn', 'uvicorn', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
  game: ['overview', 'serverConfig', 'plugins', 'mods', 'players', 'backup', 'monitor', 'security'],
  app: ['overview', 'domain', 'ssl', 'git', 'env', 'cron', 'backup', 'monitor', 'files', 'security', 'deploy'],
  data: ['overview', 'model', 'gpu', 'inference', 'vectorDb', 'embedding', 'env', 'monitor', 'security'],
  api: ['overview', 'domain', 'ssl', 'git', 'env', 'rateLimit', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
  docker: ['overview', 'containers', 'images', 'volumes', 'networks', 'env', 'monitor', 'security', 'backup'],
  static: ['overview', 'domain', 'ssl', 'git', 'files', 'cache', 'security', 'deploy'],
  java: ['overview', 'domain', 'ssl', 'git', 'env', 'javaVersion', 'build', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
  rust: ['overview', 'domain', 'ssl', 'git', 'env', 'version', 'build', 'cron', 'backup', 'monitor', 'files', 'redis', 'cache', 'security', 'access', 'deploy'],
};

const initialMockProjects: ProjectData[] = [
  { id: 'p1', name: 'cms-laravel-shop', type: 'web-php', server: 'VPS-SG-01', domain: 'cms.example.com', status: 'running', createdAt: '2026-05-10T10:00:00Z', git: 'https://github.com/example/laravel-shop', description: 'Laravel 10 E-commerce CMS' },
  { id: 'p2', name: 'wordpress-news-blog', type: 'web-php', server: 'VPS-TYO-02', domain: 'news.example.com', status: 'running', createdAt: '2026-05-12T14:30:00Z', git: 'https://github.com/example/wp-theme', description: 'WordPress 6.4 News Portal' },
  { id: 'p3', name: 'symfony-admin-api', type: 'web-php', server: 'VPS-FRA-03', domain: 'admin.example.com', status: 'stopped', createdAt: '2026-05-15T09:15:00Z', git: 'https://github.com/example/symfony-api', description: 'Symfony 7 Admin Engine' },
  { id: 'p4', name: 'web-shop-react', type: 'web-nodejs', server: 'VPS-SG-01', domain: 'shop.example.com', status: 'running', createdAt: '2026-05-01T08:00:00Z', git: 'https://github.com/example/web-shop', description: 'React 18 + Node 20 Frontend' },
  { id: 'p5', name: 'express-microservice-auth', type: 'web-nodejs', server: 'VPS-TYO-02', domain: 'auth.example.com', status: 'running', createdAt: '2026-05-03T11:20:00Z', git: 'https://github.com/example/express-auth', description: 'Express JWT Auth Server' },
  { id: 'p6', name: 'nginx-reverse-proxy-gateway', type: 'web-proxy', server: 'VPS-TYO-02', domain: 'proxy.example.com', status: 'running', createdAt: '2026-04-20T16:00:00Z', description: 'Nginx SSL Ingress Router' },
  { id: 'p7', name: 'traefik-edge-load-balancer', type: 'web-proxy', server: 'VPS-FRA-03', domain: 'gateway.example.com', status: 'stopped', createdAt: '2026-04-22T10:45:00Z', description: 'Traefik v3 Dynamic Proxy' },
  { id: 'p8', name: 'gin-highspeed-auth', type: 'web-go', server: 'VPS-SG-01', domain: 'auth.go.example.com', status: 'running', createdAt: '2026-05-05T12:00:00Z', git: 'https://github.com/example/gin-auth', description: 'Gin Gonic Go 1.22 Auth API' },
  { id: 'p9', name: 'fiber-websocket-hub', type: 'web-go', server: 'VPS-US-04', domain: 'ws.go.example.com', status: 'stopped', createdAt: '2026-05-08T15:30:00Z', git: 'https://github.com/example/fiber-ws', description: 'Fiber v2 Realtime Push Gateway' },
  { id: 'p10', name: 'django-enterprise-portal', type: 'web-python', server: 'VPS-FRA-03', domain: 'portal.py.example.com', status: 'running', createdAt: '2026-04-18T09:00:00Z', git: 'https://github.com/example/django-portal', description: 'Django 5.0 Enterprise Portal' },
  { id: 'p11', name: 'fastapi-ml-inference', type: 'web-python', server: 'VPS-SG-01', domain: 'ai-api.example.com', status: 'running', createdAt: '2026-04-25T13:10:00Z', git: 'https://github.com/example/fastapi-ml', description: 'FastAPI 0.109 PyTorch Server' },
  { id: 'p12', name: 'minecraft-survival-smp', type: 'game', server: 'VPS-SG-01', domain: 'mc.example.com', status: 'running', createdAt: '2026-05-01T12:00:00Z', description: 'Paper Minecraft 1.20.4 SMP Server' },
  { id: 'p13', name: 'cs2-competitive-matchmaking', type: 'game', server: 'VPS-TYO-02', domain: 'cs2.example.com', status: 'stopped', createdAt: '2026-05-04T18:00:00Z', description: 'CS2 Dedicated 128-tick Server' },
  { id: 'p14', name: 'fivem-roleplay-city-v2', type: 'game', server: 'VPS-FRA-03', domain: 'fivem.example.com', status: 'running', createdAt: '2026-05-10T20:15:00Z', description: 'FiveM FXServer Custom City RP' },
  { id: 'p15', name: 'rust-pvp-survival-x5', type: 'game', server: 'VPS-US-04', domain: 'rust.example.com', status: 'running', createdAt: '2026-05-12T22:00:00Z', description: 'Rust Server Procedural Map 4000' },
  { id: 'p16', name: 'electron-desktop-sync', type: 'app', server: 'VPS-US-04', domain: 'sync.app.example.com', status: 'running', createdAt: '2026-03-30T11:00:00Z', git: 'https://github.com/example/electron-app', description: 'Electron Desktop Sync Manager' },
  { id: 'p17', name: 'flutter-mobile-backend', type: 'app', server: 'VPS-SG-01', domain: 'mobile.example.com', status: 'running', createdAt: '2026-04-05T14:20:00Z', git: 'https://github.com/example/mobile-backend', description: 'Cross-platform Mobile API Push' },
  { id: 'p18', name: 'llm-rag-pipeline', type: 'data', server: 'VPS-FRA-03', domain: 'rag.ai.example.com', status: 'stopped', createdAt: '2026-05-02T10:00:00Z', git: 'https://github.com/example/rag-pipeline', description: 'LangChain + Chroma Vector Pipeline' },
  { id: 'p19', name: 'tensorflow-gpu-trainer', type: 'data', server: 'VPS-FRA-03', domain: 'train.ai.example.com', status: 'running', createdAt: '2026-05-06T17:45:00Z', description: 'TensorFlow 2.15 Model Training CUDA' },
  { id: 'p20', name: 'graphql-federation-gateway', type: 'api', server: 'VPS-SG-01', domain: 'graphql.example.com', status: 'running', createdAt: '2026-04-15T08:30:00Z', git: 'https://github.com/example/graphql-mw', description: 'Apollo GraphQL Supergraph Gateway' },
  { id: 'p21', name: 'stripe-payment-service', type: 'api', server: 'VPS-TYO-02', domain: 'pay.example.com', status: 'running', createdAt: '2026-04-19T13:50:00Z', git: 'https://github.com/example/payment-api', description: 'Stripe Webhooks & Invoice Microservice' },
  { id: 'p22', name: 'docker-private-registry', type: 'docker', server: 'VPS-FRA-03', domain: 'registry.example.com', status: 'stopped', createdAt: '2026-03-25T09:00:00Z', git: 'https://github.com/example/docker-reg', description: 'Private Docker V2 Image Registry' },
  { id: 'p23', name: 'k8s-ingress-cluster-stack', type: 'docker', server: 'VPS-SG-01', domain: 'k8s.example.com', status: 'running', createdAt: '2026-04-01T15:00:00Z', description: 'Kubernetes Ingress & Helm Deployments' },
  { id: 'p24', name: 'docs-hugo-technical-site', type: 'static', server: 'VPS-SG-01', domain: 'docs.example.com', status: 'running', createdAt: '2026-04-10T11:15:00Z', git: 'https://github.com/example/hugo-docs', description: 'Hugo Fast Static Documentation Site' },
  { id: 'p25', name: 'astro-landing-page-v3', type: 'static', server: 'VPS-TYO-02', domain: 'landing.example.com', status: 'running', createdAt: '2026-04-12T16:40:00Z', git: 'https://github.com/example/astro-landing', description: 'Astro 4 SSG Product Landing Page' },
  { id: 'p26', name: 'spring-boot-ecommerce-core', type: 'java', server: 'VPS-FRA-03', domain: 'spring.example.com', status: 'running', createdAt: '2026-04-02T10:00:00Z', git: 'https://github.com/example/spring-shop', description: 'Spring Boot 3.2 Java 21 Enterprise' },
  { id: 'p27', name: 'quarkus-event-bus-broker', type: 'java', server: 'VPS-US-04', domain: 'quarkus.example.com', status: 'stopped', createdAt: '2026-04-08T14:10:00Z', git: 'https://github.com/example/quarkus-bus', description: 'Quarkus Native Microservice Broker' },
  { id: 'p28', name: 'actix-web-highperf-engine', type: 'rust', server: 'VPS-SG-01', domain: 'rust.example.com', status: 'running', createdAt: '2026-04-14T09:20:00Z', git: 'https://github.com/example/actix-engine', description: 'Actix Web 4 High-performance Server' },
  { id: 'p29', name: 'axum-telemetry-collector', type: 'rust', server: 'VPS-TYO-02', domain: 'telemetry.example.com', status: 'running', createdAt: '2026-04-16T12:00:00Z', git: 'https://github.com/example/axum-collector', description: 'Axum 0.7 Tokio Metrics Collector' },
  { id: 'p30', name: 'custom-cron-script-runner', type: 'other', server: 'VPS-US-04', domain: 'cron.example.com', status: 'stopped', createdAt: '2026-03-20T18:00:00Z', description: 'Scheduled Cron Shell Tasks Engine' },
];

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<ProjectData[]>(initialMockProjects);
  const [servers, setServers] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState<ProjectType>(category && slugToTypeMap[category] ? slugToTypeMap[category] : 'web-php');

  useEffect(() => {
    if (category && slugToTypeMap[category]) {
      setActiveTab(slugToTypeMap[category]);
    }
  }, [category]);

  const handleTabChange = (key: string) => {
    const projType = key as ProjectType;
    setActiveTab(projType);
    const slug = typeToSlugMap[projType] || projType;
    navigate(`/projects/${slug}`);
  };
  const [editTab, setEditTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchAction, setBatchAction] = useState<string>('');
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [actionConfirmKey, setActionConfirmKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const fields = createFieldConfig[activeTab] || otherFields;

  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, servRes] = await Promise.all([projectsApi.getAll(), serversApi.getAll()]);
      const projList = Array.isArray(projRes?.data) ? projRes.data : (Array.isArray(projRes?.data?.data) ? projRes.data.data : []);
      const servList = Array.isArray(servRes?.data) ? servRes.data : (Array.isArray(servRes?.data?.data) ? servRes.data.data : []);
      
      // Combine API items with initial mock projects ensuring all types are populated
      const combined = [...projList];
      for (const m of initialMockProjects) {
        if (!combined.some(p => p.name === m.name)) {
          combined.push(m);
        }
      }
      setProjects(combined);
      setServers(servList);
    } catch {
      setProjects(initialMockProjects);
      message.error(t('projects.msgErrorLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    form.validateFields().then(async (values: any) => {
      try {
        setActionLoading('add');
        await projectsApi.create({ ...values, type: activeTab, status: 'stopped' });
        message.success(t('projects.msgSuccessCreate'));
        form.resetFields();
        setOpen(false);
        loadData();
      } catch (err: any) {
        message.error(err.response?.data?.message || t('projects.msgErrorCreate'));
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsApi.remove(id);
      message.success(t('projects.msgSuccessDelete'));
      loadData();
    } catch {
      message.error(t('projects.msgErrorDelete'));
    }
  };

  const handleToggleStatus = async (record: ProjectData) => {
    const nextStatus = record.status === 'running' ? 'stopped' : 'running';
    message.loading({ content: t('projects.msgProcessing'), key: 'proj_status' });
    try {
      await projectsApi.update(record.id, { status: nextStatus });
      message.success({ content: nextStatus === 'running' ? t('projects.msgStarted') : t('projects.msgStopped'), key: 'proj_status', duration: 2 });
      loadData();
    } catch {
      message.error({ content: t('projects.msgErrorToggle'), key: 'proj_status' });
    }
  };

  const handleEdit = (record: ProjectData) => {
    setSelectedProject(record);
    setEditTab('overview');
    editForm.setFieldsValue(record);
    setEditOpen(true);
  };

  const handleViewDetail = (record: ProjectData) => {
    setSelectedProject(record);
    setDetailOpen(true);
  };

  const handleViewLogs = (record: ProjectData) => {
    setSelectedProject(record);
    setLogOpen(true);
  };

  const handleExecuteBatch = () => {
    if (!batchAction) {
      message.warning(t('projects.msgSelectAction'));
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.warning(t('projects.msgSelectAtLeast'));
      return;
    }
    if (batchAction === 'delete') {
      Modal.confirm({
        title: t('projects.batchDeleteTitle'),
        content: t('projects.batchDeleteContent').replace('{count}', String(selectedRowKeys.length)),
        okText: t('common.yes'), cancelText: t('common.no'),
        onOk: async () => {
          for (const k of selectedRowKeys) await projectsApi.remove(k as string);
          message.success(t('projects.msgSuccessBatchDelete'));
          setSelectedRowKeys([]);
          loadData();
        }
      });
    } else if (batchAction === 'stop') {
      message.loading({ content: t('projects.msgStoppingBatch').replace('{count}', String(selectedRowKeys.length)), key: 'stop_batch' });
      setTimeout(() => {
        message.success({ content: t('projects.msgStoppedBatch'), key: 'stop_batch', duration: 2 });
        setSelectedRowKeys([]);
      }, 1500);
    } else if (batchAction === 'start') {
      message.loading({ content: t('projects.msgStartingBatch').replace('{count}', String(selectedRowKeys.length)), key: 'start_batch' });
      setTimeout(() => {
        message.success({ content: t('projects.msgStartedBatch'), key: 'start_batch', duration: 2 });
        setSelectedRowKeys([]);
      }, 1500);
    }
  };

  const handleBatchDelete = () => {
    if (!selectedRowKeys.length) return;
    Modal.confirm({
      title: t('projects.batchDeleteTitle'),
      content: t('projects.batchDeleteConfirm').replace('{count}', String(selectedRowKeys.length)),
      okText: t('common.yes'), cancelText: t('common.no'),
      onOk: async () => {
        for (const key of selectedRowKeys) {
          await projectsApi.remove(key as string);
        }
        message.success(t('projects.msgBatchDeleted').replace('{count}', String(selectedRowKeys.length)));
        setSelectedRowKeys([]);
        loadData();
      },
    });
  };

  const handleExport = (format: 'excel' | 'csv') => {
    message.success(t('projects.msgExporting').replace('{format}', format.toUpperCase()));
    setTimeout(() => message.success(t('projects.msgExported').replace('{format}', format.toUpperCase())), 1000);
  };

  const safeServers = Array.isArray(servers) ? servers : [];
  const serverOptions = safeServers.map(s => ({ label: s.name, value: s.name }));

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filteredProjects = safeProjects.filter(p => {
    if (activeTab && p.type !== activeTab) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.domain?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const localeMap: Record<string, string> = { vi: 'vi-VN', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };

  const columns = [
    { title: t('projects.colName'), dataIndex: 'name', key: 'name', render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span>, sorter: (a: ProjectData, b: ProjectData) => a.name.localeCompare(b.name) },

    { title: t('projects.colServer'), dataIndex: 'server', key: 'server', render: (v: string) => v || '—' },
    { title: 'Domain', dataIndex: 'domain', key: 'domain', render: (v: string) => v ? <a href={`https://${v}`} target="_blank" rel="noreferrer" style={{ color: '#009688' }}>{v}</a> : <span style={{ color: '#bbb' }}>—</span> },
    { title: t('projects.colStatus'), dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'running' ? 'success' : 'default'} style={{ borderRadius: 4, margin: 0 }}>{v === 'running' ? t('projects.statusRunning') : t('projects.statusStopped')}</Tag>, filters: [{ text: t('projects.statusRunning'), value: 'running' }, { text: t('projects.statusStopped'), value: 'stopped' }], onFilter: (value: any, record: ProjectData) => record.status === value },
    { title: t('projects.colCreated'), dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => <span style={{ color: '#999', fontSize: 12 }}>{new Date(v).toLocaleDateString(localeMap[language] || 'vi-VN')}</span>, sorter: (a: ProjectData, b: ProjectData) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() },
    {
      title: t('projects.colActions'), key: 'actions', width: 350,
      render: (_: any, r: ProjectData) => (
        <Space>
          {(r.type === 'game' || activeTab === 'game') && (
            <Tooltip title="Minecraft Panel">
              <Button
                size="small"
                type="primary"
                icon={<ControlOutlined />}
                onClick={() => navigate('/game/minecraft')}
                style={{ backgroundColor: '#009688', borderColor: '#009688' }}
              >
                Panel
              </Button>
            </Tooltip>
          )}
          <Tooltip title={t('projects.tooltipView')}><Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(r)} /></Tooltip>
          <Tooltip title={t('projects.tooltipEdit')}><Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)} /></Tooltip>
          <Tooltip title={t('projects.tooltipLogs')}><Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewLogs(r)} /></Tooltip>
          {r.git && <Tooltip title={t('projects.tooltipGit')}><Button size="small" icon={<GithubOutlined />} onClick={() => window.open(r.git, '_blank')} /></Tooltip>}
          <Tooltip title={r.status === 'running' ? t('projects.tooltipStop') : t('projects.tooltipStart')} open={hoverKey === `action-${r.id}` && actionConfirmKey !== r.id}>
            <Popconfirm 
              title={t('projects.confirmToggle').replace('{action}', r.status === 'running' ? t('projects.tooltipStop').toLowerCase() : t('projects.tooltipStart').toLowerCase())} 
              placement="left"
              onConfirm={() => handleToggleStatus(r)} 
              okText={t('projects.confirmOk')} cancelText={t('common.cancel')}
              okButtonProps={r.status === 'running' ? { danger: true, style: { color: 'black' } } : { type: 'primary' }}
              onOpenChange={(open) => { if (open) setActionConfirmKey(r.id); }}
              afterOpenChange={(open) => {
                if (!open) { setActionConfirmKey(null); setHoverKey(null); }
              }}
            >
              <Button 
                size="small" 
                type={r.status === 'running' ? 'default' : 'primary'} 
                icon={<RocketOutlined />}
                onMouseEnter={() => setHoverKey(`action-${r.id}`)}
                onMouseLeave={() => setHoverKey(null)}
              >
                {r.status === 'running' ? t('projects.tooltipStop') : t('projects.tooltipStart')}
              </Button>
            </Popconfirm>
          </Tooltip>
          <Tooltip title={t('projects.tooltipDelete')} open={hoverKey === `delete-${r.id}` && deleteConfirmKey !== r.id}>
            <Popconfirm 
              title={t('projects.confirmDelete')} 
              description={t('projects.confirmDeleteDesc')}
              placement="left"
              onConfirm={() => handleDelete(r.id)} 
              okText={t('common.yes')} 
              cancelText={t('common.no')}
              onOpenChange={(open) => { if (open) setDeleteConfirmKey(r.id); }}
              afterOpenChange={(open) => {
                if (!open) { setDeleteConfirmKey(null); setHoverKey(null); }
              }}
            >
              <Button 
                size="small" 
                danger 
                icon={<DeleteOutlined />}
                onMouseEnter={() => setHoverKey(`delete-${r.id}`)}
                onMouseLeave={() => setHoverKey(null)}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        style={{ marginBottom: 12 }}
        items={projectTypes.map(t => ({
          key: t.key,
          label: t.label,
        }))}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Input prefix={<SearchOutlined style={{ color: '#bbb' }} />} placeholder={t('projects.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 320, borderRadius: 6 }} allowClear />
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>{t('projects.exportExcel')}</Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport('csv')}>{t('projects.exportCsv')}</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>{t('projects.createProject')} {activeTab !== 'other' ? typeMap[activeTab]?.label : ''}</Button>
        </Space>
      </div>

      <KTable
        viewKeyPrefix={`proj-${activeTab}-${search}`}
        rowKey="id"
        dataSource={filteredProjects}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: () => {
            const isAllSelected = filteredProjects.length > 0 && selectedRowKeys.length === filteredProjects.length;
            const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < filteredProjects.length;
            return (
              <Space>
                <Checkbox
                  style={{ marginLeft: 0, marginRight: 10 }}
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={(e) => setSelectedRowKeys(e.target.checked ? filteredProjects.map(d => d.id) : [])}
                />
                <Select
                  size="small"
                  value={batchAction || undefined}
                  onChange={setBatchAction}
                  style={{ width: 140 }}
                  placeholder={t('projects.batchPlaceholder')}
                  options={[
                    { value: 'start', label: <Space><PlayCircleOutlined /> {t('projects.batchStart')}</Space> },
                    { value: 'stop', label: <Space><StopOutlined /> {t('projects.batchStop')}</Space> },
                    { value: 'delete', label: <Space><DeleteOutlined /> {t('projects.batchDelete')}</Space> }
                  ]}
                />
                <Button size="small" type={batchAction && selectedRowKeys.length > 0 ? "primary" : "default"} onClick={handleExecuteBatch}>{t('projects.batchExecute')}</Button>
              </Space>
            );
          }
        }}
        size="middle"
        locale={{ emptyText: t('projects.emptyText') }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />

      <Modal title={t('projects.createModalTitle').replace('{type}', typeMap[activeTab]?.label || t('projects.createModalOther'))} open={open} onOk={handleAdd} onCancel={() => setOpen(false)} confirmLoading={actionLoading === 'add'} okText={t('projects.createModalOk')} cancelText={t('common.cancel')} width={520}>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          {fields.map(f => (
            <Form.Item key={f.name} name={f.name} label={f.label} rules={f.rules} valuePropName={f.component.type === Switch ? 'checked' : undefined}>
              {f.component}
            </Form.Item>
          ))}
          <Form.Item name="server" label={t('projects.serverLabel')}>
            <Select options={serverOptions} placeholder={t('projects.serverPlaceholder')} notFoundContent={t('projects.serverNotFound')} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={t('projects.detailTitle').replace('{name}', selectedProject?.name || '')} open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={700}>
        {selectedProject && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}><Text strong>{t('projects.detailType')}</Text><Tag color={typeMap[selectedProject.type]?.color}>{typeMap[selectedProject.type]?.label}</Tag></Col>
              <Col span={12}><Text strong>{t('projects.detailStatus')}</Text><Badge status={selectedProject.status === 'running' ? 'success' : 'default'} text={selectedProject.status === 'running' ? t('projects.statusRunning') : t('projects.statusStopped')} /></Col>
              <Col span={12}><Text strong>{t('projects.detailServer')}</Text><Text>{selectedProject.server || '—'}</Text></Col>
              <Col span={12}><Text strong>{t('projects.detailDomain')}</Text><Text>{selectedProject.domain || '—'}</Text></Col>
              <Col span={12}><Text strong>{t('projects.detailGit')}</Text><Text>{selectedProject.git || '—'}</Text></Col>
              <Col span={12}><Text strong>{t('projects.detailCreated')}</Text><Text>{new Date(selectedProject.createdAt).toLocaleString(localeMap[language] || 'vi-VN')}</Text></Col>
            </Row>
            <Divider />
            <Card
              size="small"
              tabList={[{ key: 'info', tab: t('projects.detailTabInfo') }, { key: 'monitor', tab: t('projects.detailTabMonitor') }, { key: 'security', tab: t('projects.detailTabSecurity') }, { key: 'backup', tab: t('projects.detailTabBackup') }]}
              defaultActiveTabKey="info"
            >
              <div style={{ padding: 8 }}>
                <Text style={{ color: '#757575' }}>{t('projects.detailPlaceholder')}</Text>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal title={t('projects.editTitle').replace('{name}', selectedProject?.name || '')} open={editOpen} onCancel={() => setEditOpen(false)} footer={null} width={800}>
        {selectedProject && (
          <Tabs activeKey={editTab} onChange={setEditTab} tabPosition="left" style={{ minHeight: 400 }} items={(editTabsConfig[selectedProject.type] || ['overview']).map(tab => ({
            key: tab, label: t('projects.tabs.' + tab) || tab,
            children: (
              <Form form={editForm} layout="vertical" style={{ marginTop: 0, padding: '0' }}>
                {tab === 'overview' && (
                  <>
                    <Form.Item name="name" label={t('projects.editProjectName')}><Input /></Form.Item>
                    <Form.Item name="domain" label="Domain"><Input /></Form.Item>
                    <Form.Item name="server" label={t('projects.serverLabel')}><Select options={serverOptions} /></Form.Item>
                    <Form.Item name="status" label={t('projects.editStatusLabel')}><Select options={[{ label: t('projects.statusRunning'), value: 'running' }, { label: t('projects.statusStopped'), value: 'stopped' }]} /></Form.Item>
                    <Button type="primary" icon={<SaveOutlined />} onClick={() => { editForm.validateFields().then(v => { projectsApi.update(selectedProject.id, v); message.success(t('projects.msgUpdated')); setEditOpen(false); loadData(); }); }}>{t('projects.editSaveBtn')}</Button>
                  </>
                )}
                {(tab === 'domain' || tab === 'ssl') && <DomainSslConfig projectId={selectedProject.id} />}
                {tab === 'git' && <GitConfig projectId={selectedProject.id} />}
                {tab === 'env' && <EnvConfig projectId={selectedProject.id} />}
                {tab === 'logs' && <LogViewer projectId={selectedProject.id} />}
                {tab === 'php' && <PhpConfig projectId={selectedProject.id} />}
                {tab === 'composer' && <ComposerManager projectId={selectedProject.id} />}
                {tab === 'pm2' && <NodePm2Config projectId={selectedProject.id} />}
                {(tab === 'gunicorn' || tab === 'uvicorn') && <PythonWsgiConfig projectId={selectedProject.id} />}
                {tab === 'cron' && <CronManager projectId={selectedProject.id} />}
                {tab === 'backup' && <BackupRestore projectId={selectedProject.id} />}
                {tab === 'monitor' && <Monitoring projectId={selectedProject.id} />}
                {tab === 'files' && <FilesManager projectId={selectedProject.id} />}
                {tab === 'deploy' && <DeployManager projectId={selectedProject.id} />}
                {tab === 'redis' && <RedisCacheConfig projectId={selectedProject.id} type="redis" />}
                {tab === 'cache' && <RedisCacheConfig projectId={selectedProject.id} type="cache" />}
                {tab === 'security' && <SecurityConfig projectId={selectedProject.id} type="security" />}
                {tab === 'access' && <SecurityConfig projectId={selectedProject.id} type="access" />}

                {/* Game specific */}
                {['serverConfig', 'plugins', 'mods', 'players'].includes(tab) && <GameServerConfig projectId={selectedProject.id} type={tab} />}

                {/* AI specific */}
                {['model', 'gpu', 'inference', 'vectorDb', 'embedding'].includes(tab) && <AiDataConfig projectId={selectedProject.id} type={tab} />}

                {/* Docker specific */}
                {['containers', 'images', 'volumes', 'networks'].includes(tab) && <DockerManager projectId={selectedProject.id} type={tab} />}

                {/* Misc */}
                {['goVersion', 'javaVersion', 'rateLimit', 'settings', 'version', 'build'].includes(tab) && <MiscSettings projectId={selectedProject.id} type={tab} />}

                {!['overview', 'domain', 'ssl', 'git', 'env', 'logs', 'php', 'composer', 'pm2', 'gunicorn', 'uvicorn', 'cron', 'backup', 'monitor', 'files', 'deploy', 'redis', 'cache', 'security', 'access', 'serverConfig', 'plugins', 'mods', 'players', 'model', 'gpu', 'inference', 'vectorDb', 'embedding', 'containers', 'images', 'volumes', 'networks', 'goVersion', 'javaVersion', 'rateLimit', 'settings', 'version', 'build'].includes(tab) && (
                  <Text style={{ color: '#757575' }}>{t('projects.editComingSoon').replace('{tab}', tab.toLowerCase())}</Text>
                )}
              </Form>
            ),
          }))} />
        )}
      </Modal>

      <Modal title={t('projects.logTitle').replace('{name}', selectedProject?.name || '')} open={logOpen} onCancel={() => setLogOpen(false)} footer={null} width={600}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between' }}>
            <div><Tag color="blue" style={{ borderRadius: 4 }}>{t('projects.logUpdate')}</Tag><Text>{t('projects.logDnsChange')}</Text></div>
            <Text style={{ color: '#999', fontSize: 12 }}>{t('projects.logDaysAgo').replace('{n}', String(i))}</Text>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Projects;
