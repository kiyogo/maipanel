import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { KTable } from '../components/KTable';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Tabs,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Table,
  Tooltip,
  Modal,
  Avatar,
  message,
  Progress,
  Badge,
  Popconfirm,
  Dropdown,
  Alert,
  Checkbox
} from '../custom-ui';
import {
  ArrowLeftOutlined,
  RocketOutlined,
  PlayCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  CodeOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
  FolderOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  ClearOutlined,
  DownloadOutlined,
  UndoOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  HddOutlined,
  ControlOutlined,
  FileOutlined,
  FolderOpenOutlined,
  EditOutlined,
  ThunderboltOutlined,
  MobileOutlined,
  DesktopOutlined,
  FileTextOutlined,
  CrownOutlined,
  BuildOutlined,
  ExperimentOutlined,
  DeploymentUnitOutlined,
  FireOutlined,
  CoffeeOutlined,
  StarFilled,
  DownOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';
import FilesPage from './Files';

const { Title, Text, Paragraph } = Typography;

interface Player {
  key: string;
  name: string;
  uuid: string;
  ping: number;
  playtime: string;
  dimension: string;
  isOp: boolean;
}

interface InventoryItem {
  slot: number;
  id: string;
  count: number;
  name?: string;
  lore?: string[];
}

interface CustomMetaItem {
  key: string;
  value: string;
}

interface PlayerDetail extends Player {
  health: number;
  food: number;
  xpLevel: number;
  xpProgress: number;
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  posX: number;
  posY: number;
  posZ: number;
  flyMode: boolean;
  godMode: boolean;
  inventory: InventoryItem[];
  enderChest: InventoryItem[];
  customMeta: CustomMetaItem[];
}

interface PluginItem {
  key: string;
  name: string;
  version: string;
  author: string;
  size: string;
  status: boolean;
}

interface BackupItem {
  key: string;
  filename: string;
  date: string;
  size: string;
  type: string;
}

interface ServerFileItem {
  key: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
  permissions: string;
}

interface MarketplaceItem {
  id: string;
  name: string;
  author: string;
  downloads: string;
  rating: number;
  platform: 'SpigotMC' | 'Modrinth' | 'CurseForge';
  category: 'admin' | 'world' | 'performance' | 'gameplay' | 'cosmetics';
  version: string;
  size: string;
  desc: string;
  icon: React.ReactNode;
  installed: boolean;
}

const basePlugins: MarketplaceItem[] = [
  {
    id: 'essentialsx',
    name: 'EssentialsX',
    author: 'TeamCity',
    downloads: '14.2M',
    rating: 5.0,
    platform: 'SpigotMC',
    category: 'admin',
    version: '2.20.1',
    size: '3.2 MB',
    desc: 'Bộ công cụ quản lý máy chủ thiết yếu số 1 với hơn 130+ lệnh hữu ích (spawn, home, tp, economy, warp).',
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#1890ff' }} />,
    installed: true
  },
  {
    id: 'luckperms',
    name: 'LuckPerms',
    author: 'Luck',
    downloads: '11.8M',
    rating: 5.0,
    platform: 'Modrinth',
    category: 'admin',
    version: '5.4.102',
    size: '6.4 MB',
    desc: 'Hệ thống quản lý phân quyền (Permissions) thế hệ mới siêu nhanh kèm giao diện Web Editor chuyên nghiệp.',
    icon: <CrownOutlined style={{ fontSize: 22, color: '#722ed1' }} />,
    installed: true
  },
  {
    id: 'worldedit',
    name: 'WorldEdit',
    author: 'EngineHub',
    downloads: '18.5M',
    rating: 5.0,
    platform: 'SpigotMC',
    category: 'world',
    version: '7.2.15',
    size: '5.8 MB',
    desc: 'Công cụ chỉnh sửa bản đồ & kiến trúc bằng lệnh khối lượng lớn nhanh nhất Minecraft.',
    icon: <BuildOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
    installed: true
  },
  {
    id: 'worldguard',
    name: 'WorldGuard',
    author: 'EngineHub',
    downloads: '12.1M',
    rating: 4.9,
    platform: 'SpigotMC',
    category: 'world',
    version: '7.0.9',
    size: '2.1 MB',
    desc: 'Bảo vệ vùng đất (Region protection), chống đập block, cấm PvP và tùy chỉnh luật lệ từng vùng.',
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#13c2c2' }} />,
    installed: false
  },
  {
    id: 'vault',
    name: 'Vault',
    author: 'Slekit',
    downloads: '22.0M',
    rating: 5.0,
    platform: 'SpigotMC',
    category: 'admin',
    version: '1.7.3',
    size: '420 KB',
    desc: 'API cầu nối kết nối hệ thống Tiền tệ (Economy), Phân quyền và Chat cho hàng ngàn plugin khác.',
    icon: <CheckCircleOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
    installed: true
  },
  {
    id: 'geyser',
    name: 'Geyser-Spigot',
    author: 'GeyserMC',
    downloads: '6.4M',
    rating: 4.9,
    platform: 'Modrinth',
    category: 'performance',
    version: '2.2.0',
    size: '14.5 MB',
    desc: 'Cho phép người chơi Bedrock Edition (Điện thoại, Console, PE) vào chơi chung với máy chủ Java Edition.',
    icon: <MobileOutlined style={{ fontSize: 22, color: '#009688' }} />,
    installed: true
  },
  {
    id: 'protocollib',
    name: 'ProtocolLib',
    author: 'dmulloy2',
    downloads: '16.8M',
    rating: 4.9,
    platform: 'SpigotMC',
    category: 'performance',
    version: '5.1.0',
    size: '2.4 MB',
    desc: 'Thư viện can thiệp gói tin (Packet wrapper API) cho phép các plugin đọc và chỉnh sửa Minecraft Packets.',
    icon: <CodeOutlined style={{ fontSize: 22, color: '#2f54eb' }} />,
    installed: false
  },
  {
    id: 'spark',
    name: 'Spark',
    author: 'Luck',
    downloads: '5.2M',
    rating: 5.0,
    platform: 'Modrinth',
    category: 'performance',
    version: '1.10.53',
    size: '3.8 MB',
    desc: 'Công cụ đo đạc hiệu năng CPU, RAM, TPS và phân tích lag chập giật của máy chủ chính xác tuyệt đối.',
    icon: <ThunderboltOutlined style={{ fontSize: 22, color: '#fadb14' }} />,
    installed: false
  },
  {
    id: 'coreprotect',
    name: 'CoreProtect',
    author: 'Intelli',
    downloads: '9.6M',
    rating: 5.0,
    platform: 'SpigotMC',
    category: 'admin',
    version: '22.2',
    size: '2.9 MB',
    desc: 'Hệ thống tra cứu lịch sử đập block, mở rương, đặt lava và rollback cứu máy chủ khỏi phá hoại.',
    icon: <UndoOutlined style={{ fontSize: 22, color: '#eb2f96' }} />,
    installed: true
  },
  {
    id: 'viaversion',
    name: 'ViaVersion',
    author: 'ViaVersion',
    downloads: '13.4M',
    rating: 5.0,
    platform: 'SpigotMC',
    category: 'performance',
    version: '4.9.0',
    size: '4.1 MB',
    desc: 'Cho phép người chơi dùng các phiên bản Client cũ hoặc mới hơn vào chơi trên máy chủ của bạn.',
    icon: <ReloadOutlined style={{ fontSize: 22, color: '#1890ff' }} />,
    installed: true
  },
  {
    id: 'griefprevention',
    name: 'GriefPrevention',
    author: 'BigScary',
    downloads: '7.8M',
    rating: 4.8,
    platform: 'SpigotMC',
    category: 'gameplay',
    version: '16.18.2',
    size: '1.4 MB',
    desc: 'Tự động bảo vệ nhà bằng Xẻng vàng (Claim Land), chống phá hoại dành riêng cho máy chủ Survival.',
    icon: <ToolOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
    installed: false
  },
  {
    id: 'multiverse',
    name: 'Multiverse-Core',
    author: 'Multiverse',
    downloads: '15.1M',
    rating: 4.9,
    platform: 'SpigotMC',
    category: 'world',
    version: '4.3.12',
    size: '1.8 MB',
    desc: 'Quản lý nhiều thế giới (Worlds) độc lập trên cùng một máy chủ, tạo thế giới Nether, End, Resource World.',
    icon: <AppstoreOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
    installed: false
  },
  {
    id: 'clearlag',
    name: 'ClearLag',
    author: 'bob7l',
    downloads: '8.4M',
    rating: 4.7,
    platform: 'SpigotMC',
    category: 'performance',
    version: '3.2.2',
    size: '350 KB',
    desc: 'Dọn dẹp rác dưới đất, giới hạn thực thể sinh ra và giảm thiểu tối đa tình trạng giật lag cho server.',
    icon: <ThunderboltOutlined style={{ fontSize: 22, color: '#f5222d' }} />,
    installed: false
  },
  {
    id: 'citizens',
    name: 'Citizens',
    author: 'Fullwall',
    downloads: '4.9M',
    rating: 4.8,
    platform: 'SpigotMC',
    category: 'gameplay',
    version: '2.0.33',
    size: '1.2 MB',
    desc: 'Tạo các NPC (nhân vật ảo) thông minh có thể di chuyển, trò chuyện, giao nhiệm vụ hoặc làm bảo vệ.',
    icon: <UserOutlined style={{ fontSize: 22, color: '#faad14' }} />,
    installed: false
  },
  {
    id: 'decentholograms',
    name: 'DecentHolograms',
    author: 'DecentSoftware',
    downloads: '3.1M',
    rating: 4.9,
    platform: 'Modrinth',
    category: 'cosmetics',
    version: '2.8.6',
    size: '800 KB',
    desc: 'Tạo chữ và biểu tượng holographic 3D nổi trên không trung cực kỳ đẹp mắt và tốn rất ít hiệu năng.',
    icon: <ExperimentOutlined style={{ fontSize: 22, color: '#13c2c2' }} />,
    installed: false
  },
  {
    id: 'tab',
    name: 'TAB',
    author: 'NEZNAMY',
    downloads: '6.7M',
    rating: 5.0,
    platform: 'Modrinth',
    category: 'cosmetics',
    version: '4.1.5',
    size: '1.5 MB',
    desc: 'Tùy biến bảng danh sách người chơi (Tablist), thẻ tên trên đầu (Nametags) và bảng điểm bên phải (Scoreboard).',
    icon: <DesktopOutlined style={{ fontSize: 22, color: '#eb2f96' }} />,
    installed: false
  },
  {
    id: 'gsit',
    name: 'GSit',
    author: 'GamerTech',
    downloads: '2.8M',
    rating: 4.8,
    platform: 'SpigotMC',
    category: 'gameplay',
    version: '1.7.0',
    size: '300 KB',
    desc: 'Cho phép người chơi ngồi lên mọi block, nằm ngủ dưới đất hoặc cưỡi lên vai người chơi khác vô cùng thú vị.',
    icon: <CoffeeOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
    installed: false
  },
  {
    id: 'skinsrestorer',
    name: 'SkinsRestorer',
    author: 'SkinsRestorer',
    downloads: '10.2M',
    rating: 4.9,
    platform: 'SpigotMC',
    category: 'cosmetics',
    version: '15.0.3',
    size: '1.1 MB',
    desc: 'Tự động hiển thị và thay đổi Skin Minecraft cho người chơi ở các server crack/offline-mode.',
    icon: <UserOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
    installed: false
  },
  {
    id: 'placeholderapi',
    name: 'PlaceholderAPI',
    author: 'ExtendedClip',
    downloads: '19.4M',
    rating: 5.0,
    platform: 'SpigotMC',
    category: 'admin',
    version: '2.11.5',
    size: '450 KB',
    desc: 'Siêu API cung cấp các biến định dạng chữ (placeholders) hiển thị thông số động cho toàn bộ hệ thống.',
    icon: <DeploymentUnitOutlined style={{ fontSize: 22, color: '#2f54eb' }} />,
    installed: false
  },
  {
    id: 'discordsrv',
    name: 'DiscordSRV',
    author: 'Scarsz',
    downloads: '5.1M',
    rating: 4.9,
    platform: 'Modrinth',
    category: 'admin',
    version: '1.27.0',
    size: '4.8 MB',
    desc: 'Đồng bộ hóa khung chat của game Minecraft với các kênh chat máy chủ Discord thời gian thực.',
    icon: <DesktopOutlined style={{ fontSize: 22, color: '#722ed1' }} />,
    installed: false
  },
  {
    id: 'deluxemenus',
    name: 'DeluxeMenus',
    author: 'ExtendedClip',
    downloads: '7.2M',
    rating: 4.8,
    platform: 'SpigotMC',
    category: 'cosmetics',
    version: '1.14.0',
    size: '620 KB',
    desc: 'Tự thiết kế giao diện hòm đồ ảo (GUI Menus) tương tác đỉnh cao bằng cấu hình YAML đơn giản.',
    icon: <AppstoreOutlined style={{ fontSize: 22, color: '#13c2c2' }} />,
    installed: false
  },
  {
    id: 'aureliumskills',
    name: 'AureliumSkills',
    author: 'Archon',
    downloads: '1.9M',
    rating: 4.7,
    platform: 'SpigotMC',
    category: 'gameplay',
    version: '1.4.2',
    size: '2.2 MB',
    desc: 'Tích hợp hệ thống Kỹ năng RPG (Mining, Farming, Combat...) với bảng chỉ số và thăng cấp chuyên nghiệp.',
    icon: <FireOutlined style={{ fontSize: 22, color: '#fa541c' }} />,
    installed: false
  },
  {
    id: 'vulcan',
    name: 'Vulcan AntiCheat',
    author: 'fubaron',
    downloads: '2.5M',
    rating: 4.9,
    platform: 'SpigotMC',
    category: 'admin',
    version: '2.6.9',
    size: '1.8 MB',
    desc: 'Hệ thống chống hack/cheat cao cấp hàng đầu phát hiện các hành vi bất thường của Client cực nhanh.',
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#f5222d' }} />,
    installed: false
  },
  {
    id: 'grimac',
    name: 'Grim AntiCheat',
    author: 'GrimAC',
    downloads: '2.1M',
    rating: 4.9,
    platform: 'Modrinth',
    category: 'admin',
    version: '2.0.0',
    size: '3.4 MB',
    desc: 'Plugin chống hack mã nguồn mở thế hệ mới mô phỏng vật lý chính xác 100% Client để phát hiện hack.',
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#eb2f96' }} />,
    installed: false
  },
  {
    id: 'chunky',
    name: 'Chunky',
    author: 'pop4959',
    downloads: '3.6M',
    rating: 4.9,
    platform: 'Modrinth',
    category: 'performance',
    version: '1.3.92',
    size: '420 KB',
    desc: 'Tải trước thế giới (World pre-generation) để người chơi khám phá không bị giật khung hình và lag server.',
    icon: <BuildOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
    installed: false
  },
  {
    id: 'shopkeepers',
    name: 'Shopkeepers',
    author: 'blablothi',
    downloads: '6.1M',
    rating: 4.8,
    platform: 'SpigotMC',
    category: 'gameplay',
    version: '2.18.0',
    size: '1.1 MB',
    desc: 'Tạo các NPC dân làng (Villager Traders) để người chơi tự do trao đổi và buôn bán vật phẩm tùy chỉnh.',
    icon: <UserOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
    installed: false
  }
];

const extraPluginsList: MarketplaceItem[] = Array.from({ length: 90 }).map((_, index) => {
  const id = `plugin-gen-${index + 1}`;
  const names = [
    'FastAsyncWorldEdit', 'Floodgate', 'SimpleVoiceChat', 'Multiverse-Portals', 'Multiverse-Inventories',
    'LuckPerms-Wrapper', 'CoreProtect-Lookup', 'LWC-Extended', 'OpenInv', 'SuperVanish',
    'AdvancedPortals', 'MyCommand', 'PlaceholderAPI-Expansion', 'ProtocolLib-Helper', 'ViaBackwards',
    'ViaRewind', 'UltimateTimber', 'ExcellentCrates', 'PlayerPoints', 'TownyAdvanced',
    'FactionsUUID', 'SaberFactions', 'GriefDefender', 'RedProtect', 'WorldGuardExtraFlags',
    'FastChunkPregenerator', 'PaperTweak', 'LagGoggles', 'StackMob', 'MobManager',
    'ArmorStandTools', 'CommandPanels', 'ChestCommands', 'AnimatedNames', 'HolographicDisplays',
    'TitleManager', 'Scoreboard-Revision', 'CombatLogX', 'PvPManager', 'AntiCombatLog',
    'QuickShop', 'AuctionHouse', 'TradeSystem', 'PlayerWarps', 'SetSpawn',
    'WarpPortals', 'BetterRTP', 'RandomTeleport', 'SkinsRestorer-API', 'CustomSkins',
    'InventoryRollback', 'AdvancedBackups', 'DriveBackupV2', 'BackupToFTP', 'AutoSaveWorld',
    'FastLogin', 'AuthMe', 'SkinsRestorer-Bungee', 'LuckPerms-Bungee', 'TAB-Bungee',
    'BungeeGuard', 'Waterfall-Helper', 'Velocity-Helper', 'Protocolize', 'PremiumVanish',
    'LiteBans', 'AdvancedBan', 'MaxBans', 'MuteManager', 'ReportSystem',
    'StaffPlus', 'OpenAdmin', 'ServerTutorial', 'Hologram-Store', 'NPC-Shop',
    'Quests', 'ProQuests', 'BeautyQuests', 'JobsReborn', 'McMMO',
    'RPG-Inventory', 'MythicMobs', 'ModelEngine', 'Denizen'
  ];
  const authors = ['EngineHub', 'GeyserMC', 'henryko', 'Multiverse', 'Luck', 'Intelli', 'Slekit', 'dmulloy2', 'NEZNAMY', 'ExtendedClip', 'bob7l', 'ViaVersion'];
  const platforms: ('SpigotMC' | 'Modrinth' | 'CurseForge')[] = ['SpigotMC', 'Modrinth', 'CurseForge'];
  const categories: ('admin' | 'world' | 'performance' | 'gameplay' | 'cosmetics')[] = ['admin', 'world', 'performance', 'gameplay', 'cosmetics'];
  
  const name = names[index % names.length] + ` (Addon ${Math.floor(index / names.length) + 1})`;
  const author = authors[index % authors.length];
  const downloads = (Math.random() * 5 + 0.1).toFixed(1) + 'M';
  const rating = +(4.5 + Math.random() * 0.5).toFixed(1);
  const platform = platforms[index % platforms.length];
  const category = categories[index % categories.length];
  const version = `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`;
  const size = (Math.random() * 10 + 0.1).toFixed(1) + ' MB';
  const desc = `Tiện ích mở rộng/Addon ${name} hỗ trợ quản trị, cấu hình nâng cao và tối ưu hiệu suất cho máy chủ Minecraft của bạn.`;
  
  let icon = <BuildOutlined style={{ fontSize: 22, color: '#1890ff' }} />;
  if (category === 'admin') icon = <SafetyCertificateOutlined style={{ fontSize: 22, color: '#f5222d' }} />;
  else if (category === 'performance') icon = <ThunderboltOutlined style={{ fontSize: 22, color: '#52c41a' }} />;
  else if (category === 'cosmetics') icon = <DesktopOutlined style={{ fontSize: 22, color: '#eb2f96' }} />;
  else if (category === 'gameplay') icon = <CoffeeOutlined style={{ fontSize: 22, color: '#fa8c16' }} />;

  return {
    id,
    name,
    author,
    downloads,
    rating,
    platform,
    category,
    version,
    size,
    desc,
    icon,
    installed: false
  };
});

const marketplacePluginsList: MarketplaceItem[] = [
  ...basePlugins,
  ...extraPluginsList
];;

interface SoftwareCore {
  id: string;
  name: string;
  category: 'java' | 'bedrock';
  icon: React.ReactNode;
  desc: string;
  recommended?: boolean;
  type: string;
  versions: { label: string; value: string }[];
}

const softwareCoresList: SoftwareCore[] = [
  // Java Edition
  {
    id: 'paper',
    name: 'Paper / Bukkit',
    category: 'java',
    icon: <FileTextOutlined style={{ fontSize: 22, color: '#009688' }} />,
    desc: 'Core tối ưu hiệu năng tốt nhất cho Minecraft. Hỗ trợ đầy đủ plugin Bukkit & Spigot.',
    recommended: true,
    type: 'Plugin Support (High Performance)',
    versions: [
      { label: '1.20.4', value: '1.20.4' },
      { label: '1.20.3', value: '1.20.3' },
      { label: '1.20.2', value: '1.20.2' },
      { label: '1.20.1', value: '1.20.1' },
      { label: '1.20', value: '1.20' },
      { label: '1.19.4', value: '1.19.4' },
      { label: '1.19.3', value: '1.19.3' },
      { label: '1.19.2', value: '1.19.2' },
      { label: '1.19.1', value: '1.19.1' },
      { label: '1.19', value: '1.19' },
      { label: '1.18.2', value: '1.18.2' },
      { label: '1.18.1', value: '1.18.1' },
      { label: '1.18', value: '1.18' },
      { label: '1.17.1', value: '1.17.1' },
      { label: '1.17', value: '1.17' },
      { label: '1.16.5', value: '1.16.5' },
      { label: '1.16.4', value: '1.16.4' },
      { label: '1.16.3', value: '1.16.3' },
      { label: '1.16.2', value: '1.16.2' },
      { label: '1.16.1', value: '1.16.1' },
      { label: '1.15.2', value: '1.15.2' },
      { label: '1.14.4', value: '1.14.4' },
      { label: '1.13.2', value: '1.13.2' },
      { label: '1.12.2', value: '1.12.2' },
      { label: '1.11.2', value: '1.11.2' },
      { label: '1.10.2', value: '1.10.2' },
      { label: '1.9.4', value: '1.9.4' },
      { label: '1.8.8', value: '1.8.8' }
    ]
  },
  {
    id: 'purpur',
    name: 'Purpur / Bukkit',
    category: 'java',
    icon: <CrownOutlined style={{ fontSize: 22, color: '#722ed1' }} />,
    desc: 'Core kế thừa từ Paper với hơn 200+ tùy chỉnh nâng cao độc quyền cho server lớn.',
    type: 'Advanced Plugin Support',
    versions: [
      { label: '1.20.4', value: '1.20.4' },
      { label: '1.20.3', value: '1.20.3' },
      { label: '1.20.2', value: '1.20.2' },
      { label: '1.20.1', value: '1.20.1' },
      { label: '1.20', value: '1.20' },
      { label: '1.19.4', value: '1.19.4' },
      { label: '1.19.3', value: '1.19.3' },
      { label: '1.19.2', value: '1.19.2' },
      { label: '1.18.2', value: '1.18.2' },
      { label: '1.17.1', value: '1.17.1' },
      { label: '1.16.5', value: '1.16.5' }
    ]
  },
  {
    id: 'spigot',
    name: 'Spigot / Bukkit',
    category: 'java',
    icon: <BuildOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
    desc: 'Core phổ biến hỗ trợ plugin Spigot/Bukkit chuẩn từ Mojang API.',
    type: 'Plugin Support',
    versions: [
      { label: '1.20.4', value: '1.20.4' },
      { label: '1.20.3', value: '1.20.3' },
      { label: '1.20.2', value: '1.20.2' },
      { label: '1.20.1', value: '1.20.1' },
      { label: '1.20', value: '1.20' },
      { label: '1.19.4', value: '1.19.4' },
      { label: '1.19.3', value: '1.19.3' },
      { label: '1.19.2', value: '1.19.2' },
      { label: '1.19.1', value: '1.19.1' },
      { label: '1.19', value: '1.19' },
      { label: '1.18.2', value: '1.18.2' },
      { label: '1.18.1', value: '1.18.1' },
      { label: '1.17.1', value: '1.17.1' },
      { label: '1.17', value: '1.17' },
      { label: '1.16.5', value: '1.16.5' },
      { label: '1.16.4', value: '1.16.4' },
      { label: '1.16.3', value: '1.16.3' },
      { label: '1.16.2', value: '1.16.2' },
      { label: '1.16.1', value: '1.16.1' },
      { label: '1.15.2', value: '1.15.2' },
      { label: '1.14.4', value: '1.14.4' },
      { label: '1.13.2', value: '1.13.2' },
      { label: '1.12.2', value: '1.12.2' },
      { label: '1.11.2', value: '1.11.2' },
      { label: '1.10.2', value: '1.10.2' },
      { label: '1.9.4', value: '1.9.4' },
      { label: '1.8.8', value: '1.8.8' },
      { label: '1.7.10', value: '1.7.10' }
    ]
  },
  {
    id: 'vanilla-java',
    name: 'Vanilla (Java)',
    category: 'java',
    icon: <DesktopOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
    desc: 'Phiên bản chính thức nguyên bản 100% phát hành từ Mojang.',
    type: 'Official Mojang Core',
    versions: [
      { label: '1.20.4', value: '1.20.4' },
      { label: '1.20.3', value: '1.20.3' },
      { label: '1.20.2', value: '1.20.2' },
      { label: '1.20.1', value: '1.20.1' },
      { label: '1.20', value: '1.20' },
      { label: '1.19.4', value: '1.19.4' },
      { label: '1.19.3', value: '1.19.3' },
      { label: '1.19.2', value: '1.19.2' },
      { label: '1.19.1', value: '1.19.1' },
      { label: '1.19', value: '1.19' },
      { label: '1.18.2', value: '1.18.2' },
      { label: '1.18.1', value: '1.18.1' },
      { label: '1.17.1', value: '1.17.1' },
      { label: '1.16.5', value: '1.16.5' },
      { label: '1.15.2', value: '1.15.2' },
      { label: '1.14.4', value: '1.14.4' },
      { label: '1.13.2', value: '1.13.2' },
      { label: '1.12.2', value: '1.12.2' },
      { label: '1.11.2', value: '1.11.2' },
      { label: '1.10.2', value: '1.10.2' },
      { label: '1.9.4', value: '1.9.4' },
      { label: '1.8.9', value: '1.8.9' },
      { label: '1.8.8', value: '1.8.8' },
      { label: '1.7.10', value: '1.7.10' },
      { label: '1.6.4', value: '1.6.4' },
      { label: '1.5.2', value: '1.5.2' },
      { label: '1.4.7', value: '1.4.7' },
      { label: '1.2.5', value: '1.2.5' }
    ]
  },
  {
    id: 'snapshot-java',
    name: 'Snapshot (Java)',
    category: 'java',
    icon: <ExperimentOutlined style={{ fontSize: 22, color: '#faad14' }} />,
    desc: 'Các bản cập nhật thử nghiệm tính năng tương lai mới nhất từ Mojang.',
    type: 'Experimental Core',
    versions: [
      { label: '24w06a', value: '24w06a' },
      { label: '24w05b', value: '24w05b' },
      { label: '24w05a', value: '24w05a' },
      { label: '24w04a', value: '24w04a' },
      { label: '24w03b', value: '24w03b' },
      { label: '23w51b', value: '23w51b' },
      { label: '23w51a', value: '23w51a' },
      { label: '23w46a', value: '23w46a' },
      { label: '23w45a', value: '23w45a' },
      { label: '23w44a', value: '23w44a' }
    ]
  },
  {
    id: 'fabric',
    name: 'Fabric',
    category: 'java',
    icon: <DeploymentUnitOutlined style={{ fontSize: 22, color: '#13c2c2' }} />,
    desc: 'Core siêu nhẹ thế hệ mới, tải mod cực nhanh và tối ưu RAM tuyệt vời.',
    recommended: true,
    type: 'Lightweight Modding',
    versions: [
      { label: '1.20.4', value: '1.20.4' },
      { label: '1.20.3', value: '1.20.3' },
      { label: '1.20.2', value: '1.20.2' },
      { label: '1.20.1', value: '1.20.1' },
      { label: '1.20', value: '1.20' },
      { label: '1.19.4', value: '1.19.4' },
      { label: '1.19.3', value: '1.19.3' },
      { label: '1.19.2', value: '1.19.2' },
      { label: '1.19.1', value: '1.19.1' },
      { label: '1.19', value: '1.19' },
      { label: '1.18.2', value: '1.18.2' },
      { label: '1.18.1', value: '1.18.1' },
      { label: '1.17.1', value: '1.17.1' },
      { label: '1.16.5', value: '1.16.5' },
      { label: '1.15.2', value: '1.15.2' },
      { label: '1.14.4', value: '1.14.4' }
    ]
  },
  {
    id: 'neoforge',
    name: 'NeoForge',
    category: 'java',
    icon: <FireOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />,
    desc: 'Core modding thế hệ mới nhất kế thừa Forge cho Minecraft 1.20.2+.',
    type: 'Next-Gen Modding',
    versions: [
      { label: '1.20.4 - 20.4.167', value: '20.4.167' },
      { label: '1.20.4 - 20.4.140', value: '20.4.140' },
      { label: '1.20.4 - 20.4.80', value: '20.4.80' },
      { label: '1.20.2 - 20.2.86', value: '20.2.86' },
      { label: '1.20.2 - 20.2.50', value: '20.2.50' }
    ]
  },
  {
    id: 'forge',
    name: 'Forge',
    category: 'java',
    icon: <ToolOutlined style={{ fontSize: 22, color: '#eb2f96' }} />,
    desc: 'Core modding truyền thống lâu đời nhất, hỗ trợ hàng vạn Mod phong phú.',
    type: 'Traditional Modding',
    versions: [
      { label: '1.20.4 - 49.0.19', value: '1.20.4-49.0.19' },
      { label: '1.20.4 - 49.0.1', value: '1.20.4-49.0.1' },
      { label: '1.20.2 - 48.1.0', value: '1.20.2-48.1.0' },
      { label: '1.20.1 - 47.2.0', value: '1.20.1-47.2.0' },
      { label: '1.20.1 - 47.1.0', value: '1.20.1-47.1.0' },
      { label: '1.19.4 - 45.1.0', value: '1.19.4-45.1.0' },
      { label: '1.19.2 - 43.3.0', value: '1.19.2-43.3.0' },
      { label: '1.19.2 - 43.2.0', value: '1.19.2-43.2.0' },
      { label: '1.18.2 - 40.2.0', value: '1.18.2-40.2.0' },
      { label: '1.18.1 - 39.1.0', value: '1.18.1-39.1.0' },
      { label: '1.17.1 - 37.1.0', value: '1.17.1-37.1.0' },
      { label: '1.16.5 - 36.2.39', value: '1.16.5-36.2.39' },
      { label: '1.16.5 - 36.2.0', value: '1.16.5-36.2.0' },
      { label: '1.15.2 - 31.2.50', value: '1.15.2-31.2.50' },
      { label: '1.14.4 - 28.2.26', value: '1.14.4-28.2.26' },
      { label: '1.13.2 - 25.0.220', value: '1.13.2-25.0.220' },
      { label: '1.12.2 - 14.23.5.2860', value: '1.12.2-14.23.5.2860' },
      { label: '1.12.2 - 14.23.5.2768', value: '1.12.2-14.23.5.2768' },
      { label: '1.10.2 - 12.18.3.2511', value: '1.10.2-12.18.3.2511' },
      { label: '1.8.9 - 11.15.1.1902', value: '1.8.9-11.15.1.1902' },
      { label: '1.7.10 - 10.13.4.1614', value: '1.7.10-10.13.4.1614' }
    ]
  },

  // Bedrock Edition
  {
    id: 'vanilla-bedrock',
    name: 'Bedrock Vanilla',
    category: 'bedrock',
    icon: <MobileOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
    desc: 'Máy chủ Minecraft Bedrock Dedicated Server chính thức từ Mojang.',
    recommended: true,
    type: 'Official Bedrock Core',
    versions: [
      { label: '1.20.60.04', value: '1.20.60.04' },
      { label: '1.20.51.01', value: '1.20.51.01' },
      { label: '1.20.50.03', value: '1.20.50.03' },
      { label: '1.20.41.02', value: '1.20.41.02' },
      { label: '1.20.40.01', value: '1.20.40.01' },
      { label: '1.20.32.03', value: '1.20.32.03' },
      { label: '1.20.30.02', value: '1.20.30.02' },
      { label: '1.20.15.01', value: '1.20.15.01' },
      { label: '1.20.10.01', value: '1.20.10.01' },
      { label: '1.19.83.01', value: '1.19.83.01' },
      { label: '1.19.73.02', value: '1.19.73.02' },
      { label: '1.19.63.01', value: '1.19.63.01' },
      { label: '1.19.51.01', value: '1.19.51.01' }
    ]
  },
  {
    id: 'preview-bedrock',
    name: 'Bedrock Preview',
    category: 'bedrock',
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
    desc: 'Bản thử nghiệm Bedrock Dedicated Server với các tính năng mới sắp ra mắt.',
    type: 'Experimental Bedrock',
    versions: [
      { label: '1.20.70.21', value: '1.20.70.21' },
      { label: '1.20.70.20', value: '1.20.70.20' },
      { label: '1.20.60.26', value: '1.20.60.26' },
      { label: '1.20.60.25', value: '1.20.60.25' },
      { label: '1.20.50.24', value: '1.20.50.24' },
      { label: '1.20.40.22', value: '1.20.40.22' }
    ]
  },
  {
    id: 'pocketmine',
    name: 'PocketMine-MP',
    category: 'bedrock',
    icon: <RocketOutlined style={{ fontSize: 22, color: '#722ed1' }} />,
    desc: 'Core viết bằng PHP chuyên nghiệp cho Bedrock, hỗ trợ hệ sinh thái Plugin phong phú.',
    type: 'PHP Bedrock Plugin Core',
    versions: [
      { label: '5.12.0', value: '5.12.0' },
      { label: '5.11.2', value: '5.11.2' },
      { label: '5.11.1', value: '5.11.1' },
      { label: '5.11.0', value: '5.11.0' },
      { label: '5.10.1', value: '5.10.1' },
      { label: '5.10.0', value: '5.10.0' },
      { label: '5.9.0', value: '5.9.0' },
      { label: '5.8.0', value: '5.8.0' },
      { label: '5.7.0', value: '5.7.0' },
      { label: '5.6.0', value: '5.6.0' },
      { label: '5.5.0', value: '5.5.0' },
      { label: '5.4.0', value: '5.4.0' },
      { label: '5.3.0', value: '5.3.0' },
      { label: '5.2.0', value: '5.2.0' },
      { label: '5.1.0', value: '5.1.0' },
      { label: '5.0.0', value: '5.0.0' },
      { label: '4.23.0', value: '4.23.0' },
      { label: '4.22.0', value: '4.22.0' },
      { label: '3.27.1', value: '3.27.1' }
    ]
  }
];
const MC_ITEMS_CATALOG = [
  { id: 'minecraft:diamond_sword', label: 'Kiếm Kim Cương (Diamond Sword)', type: 'weapon' },
  { id: 'minecraft:netherite_sword', label: 'Kiếm Netherite (Netherite Sword)', type: 'weapon' },
  { id: 'minecraft:bow', label: 'Cung (Bow)', type: 'weapon' },
  { id: 'minecraft:diamond_pickaxe', label: 'Cúp Kim Cương (Diamond Pickaxe)', type: 'tool' },
  { id: 'minecraft:netherite_pickaxe', label: 'Cúp Netherite (Netherite Pickaxe)', type: 'tool' },
  { id: 'minecraft:diamond_chestplate', label: 'Giáp Ngực Kim Cương (Diamond Chestplate)', type: 'armor' },
  { id: 'minecraft:elytra', label: 'Cánh Cứng (Elytra)', type: 'armor' },
  { id: 'minecraft:golden_apple', label: 'Táo Vàng (Golden Apple)', type: 'food' },
  { id: 'minecraft:enchanted_golden_apple', label: 'Táo Vàng Phù Phép (Enchanted Golden Apple)', type: 'food' },
  { id: 'minecraft:cooked_beef', label: 'Bò Chín (Cooked Beef)', type: 'food' },
  { id: 'minecraft:bread', label: 'Bánh Mì (Bread)', type: 'food' },
  { id: 'minecraft:ender_pearl', label: 'Ngọc Ender (Ender Pearl)', type: 'misc' },
  { id: 'minecraft:totem_of_undying', label: 'Totem Trường Sinh (Totem of Undying)', type: 'misc' },
  { id: 'minecraft:diamond', label: 'Kim Cương (Diamond)', type: 'misc' },
  { id: 'minecraft:netherite_ingot', label: 'Phôi Netherite (Netherite Ingot)', type: 'misc' },
  { id: 'minecraft:obsidian', label: 'Hắc Diện Thạch (Obsidian)', type: 'block' },
  { id: 'minecraft:shulker_box', label: 'Hộp Shulker (Shulker Box)', type: 'container' },
  { id: 'minecraft:water_bucket', label: 'Xô Nước (Water Bucket)', type: 'misc' },
];

const MinecraftPanel: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { playerKey } = useParams<{ playerKey?: string }>();

  // Extract activeTab from pathname (e.g. /console -> console)
  const pathParts = location.pathname.split('/');
  const tab = pathParts[1] || 'overview';
  const [activeTab, setActiveTab] = useState(tab);

  const basePath = '';

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const handleTabChange = (k: string) => {
    setActiveTab(k);
    navigate(k === 'overview' ? '/' : `/${k}`);
  };

  // Server state
  const [serverState, setServerState] = useState<'running' | 'stopped' | 'starting' | 'restarting'>('running');
  const [copied, setCopied] = useState(false);

  // Metrics state
  const [tps, setTps] = useState(20.0);
  const [cpu, setCpu] = useState(14.5);
  const [ram, setRam] = useState(3.4);
  const [maxRam] = useState(8.0);
  const [onlineCount, setOnlineCount] = useState(18);
  const [maxPlayers, setMaxPlayers] = useState(100);

  // Console state
  const [logs, setLogs] = useState<string[]>([
    '[02:00:01 INFO]: [Server thread/INFO]: Starting Minecraft server version 1.20.4',
    '[02:00:02 INFO]: [Server thread/INFO]: Loading properties',
    '[02:00:03 INFO]: [Server thread/INFO]: Default game type: SURVIVAL',
    '[02:00:04 INFO]: [Server thread/INFO]: Generating keypair',
    '[02:00:05 INFO]: [Server thread/INFO]: Starting Minecraft server on *:25565',
    '[02:00:06 INFO]: [Server thread/INFO]: Using epoll channel type',
    '[02:00:08 INFO]: [Server thread/INFO]: Preparing level "world"',
    '[02:00:12 INFO]: [Server thread/INFO]: Preparing start region for dimension minecraft:overworld',
    '[02:00:15 INFO]: [Server thread/INFO]: Time elapsed: 3210 ms',
    '[02:00:16 INFO]: [Server thread/INFO]: Done (15.421s)! For help, type "help"',
    '[02:01:10 INFO]: [Server thread/INFO]: EssentialsX v2.20.1 enabled.',
    '[02:01:11 INFO]: [Server thread/INFO]: WorldEdit v7.2.15 enabled.',
    '[02:01:12 INFO]: [Server thread/INFO]: Geyser-Spigot v2.2.0 enabled.',
    '[02:05:22 INFO]: [Server thread/INFO]: PlayerOne logged in with entity id 142 at ([world]124.5, 64.0, -32.1)',
    '[02:10:45 INFO]: [Server thread/INFO]: GamerDude joined the game.',
    '[02:15:30 INFO]: [Server thread/INFO]: GamerDude issued server command: /tpa PlayerOne',
    '[02:15:33 INFO]: [Server thread/INFO]: PlayerOne issued server command: /tpaccept',
    '[02:22:11 INFO]: [Server thread/INFO]: CraftMaster joined the game.',
  ]);
  const [commandInput, setCommandInput] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Players list state
  const [players, setPlayers] = useState<Player[]>([
    { key: '1', name: 'PlayerOne', uuid: 'e3b8a102-12ab-4c3d-9f12-00129381023a', ping: 24, playtime: '3h 45m', dimension: 'Overworld', isOp: true },
    { key: '2', name: 'GamerDude', uuid: 'a12bc901-88ef-412a-8812-77123981011b', ping: 42, playtime: '1h 20m', dimension: 'Overworld', isOp: false },
    { key: '3', name: 'CraftMaster', uuid: 'b992f012-99ca-4e2b-1102-66381920192c', ping: 18, playtime: '45m', dimension: 'Nether', isOp: false },
    { key: '4', name: 'RedstonePro', uuid: 'c8812903-77ab-491c-2231-55192039102d', ping: 55, playtime: '5h 10m', dimension: 'The End', isOp: true },
    { key: '5', name: 'AlexBuilder', uuid: 'd7710294-66bc-482d-3342-44182039103e', ping: 31, playtime: '2h 05m', dimension: 'Overworld', isOp: false },
  ]);

  // Player detailed metadata state (initial mock details for players)
  const [playerDetails, setPlayerDetails] = useState<Record<string, PlayerDetail>>({
    'e3b8a102-12ab-4c3d-9f12-00129381023a': {
      key: '1', name: 'PlayerOne', uuid: 'e3b8a102-12ab-4c3d-9f12-00129381023a', ping: 24, playtime: '3h 45m', dimension: 'Overworld', isOp: true,
      health: 18, food: 20, xpLevel: 42, xpProgress: 0.35, gamemode: 'survival', posX: 124.5, posY: 64.0, posZ: -32.1, flyMode: false, godMode: false,
      inventory: [
        { slot: 0, id: 'minecraft:netherite_sword', count: 1, name: '§c§lĐồ Long Đao', lore: ['§7Độ sắc: Sharpness VI', '§7Sát thương: +12', '§eSở hữu: PlayerOne'] },
        { slot: 1, id: 'minecraft:cooked_beef', count: 64 },
        { slot: 2, id: 'minecraft:ender_pearl', count: 16 },
        { slot: 8, id: 'minecraft:water_bucket', count: 1 },
        { slot: 38, id: 'minecraft:elytra', count: 1, name: '§dCánh Phượng Hoàng', lore: ['§7Mức bền: Unbreaking III'] },
      ],
      enderChest: [
        { slot: 0, id: 'minecraft:diamond', count: 64 },
        { slot: 1, id: 'minecraft:netherite_ingot', count: 8 },
        { slot: 26, id: 'minecraft:totem_of_undying', count: 2 },
      ],
      customMeta: [
        { key: 'rank', value: 'VIP' },
        { key: 'prefix', value: '§6[Hiệp Sĩ]§f' },
        { key: 'coins', value: '5000' },
      ]
    },
    'a12bc901-88ef-412a-8812-77123981011b': {
      key: '2', name: 'GamerDude', uuid: 'a12bc901-88ef-412a-8812-77123981011b', ping: 42, playtime: '1h 20m', dimension: 'Overworld', isOp: false,
      health: 20, food: 15, xpLevel: 15, xpProgress: 0.8, gamemode: 'survival', posX: -521.2, posY: 72.0, posZ: 1102.4, flyMode: false, godMode: false,
      inventory: [
        { slot: 0, id: 'minecraft:diamond_sword', count: 1 },
        { slot: 1, id: 'minecraft:bread', count: 32 },
        { slot: 2, id: 'minecraft:golden_apple', count: 5 },
      ],
      enderChest: [],
      customMeta: [
        { key: 'coins', value: '120' }
      ]
    },
    'b992f012-99ca-4e2b-1102-66381920192c': {
      key: '3', name: 'CraftMaster', uuid: 'b992f012-99ca-4e2b-1102-66381920192c', ping: 18, playtime: '45m', dimension: 'Nether', isOp: false,
      health: 12, food: 18, xpLevel: 5, xpProgress: 0.2, gamemode: 'creative', posX: 12.0, posY: 85.0, posZ: 44.2, flyMode: true, godMode: true,
      inventory: [
        { slot: 0, id: 'minecraft:diamond_pickaxe', count: 1 },
        { slot: 1, id: 'minecraft:shulker_box', count: 1 },
        { slot: 2, id: 'minecraft:obsidian', count: 64 },
      ],
      enderChest: [],
      customMeta: [
        { key: 'build_count', value: '412' }
      ]
    },
    'c8812903-77ab-491c-2231-55192039102d': {
      key: '4', name: 'RedstonePro', uuid: 'c8812903-77ab-491c-2231-55192039102d', ping: 55, playtime: '5h 10m', dimension: 'The End', isOp: true,
      health: 15, food: 12, xpLevel: 88, xpProgress: 0.95, gamemode: 'survival', posX: 0.0, posY: 49.0, posZ: 12.0, flyMode: false, godMode: false,
      inventory: [
        { slot: 0, id: 'minecraft:totem_of_undying', count: 1 },
        { slot: 1, id: 'minecraft:bread', count: 16 },
      ],
      enderChest: [],
      customMeta: [
        { key: 'redstone_level', value: 'Master' }
      ]
    },
    'd7710294-66bc-482d-3342-44182039103e': {
      key: '5', name: 'AlexBuilder', uuid: 'd7710294-66bc-482d-3342-44182039103e', ping: 31, playtime: '2h 05m', dimension: 'Overworld', isOp: false,
      health: 20, food: 20, xpLevel: 24, xpProgress: 0.5, gamemode: 'survival', posX: -12.4, posY: 63.0, posZ: 154.2, flyMode: false, godMode: false,
      inventory: [
        { slot: 0, id: 'minecraft:cooked_beef', count: 64 },
      ],
      enderChest: [],
      customMeta: []
    }
  });

  const [detailVisible, setDetailVisible] = useState(false);
  const [editingPlayerKey, setEditingPlayerKey] = useState<string | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'status' | 'inventory' | 'custom'>('status');

  // Slot editor state
  const [slotEditorVisible, setSlotEditorVisible] = useState(false);
  const [editingSlotType, setEditingSlotType] = useState<'inventory' | 'enderChest'>('inventory');
  const [editingSlotNumber, setEditingSlotNumber] = useState<number>(0);
  const [slotItemId, setSlotItemId] = useState('minecraft:diamond_sword');
  const [slotItemCount, setSlotItemCount] = useState<number>(1);
  const [slotItemName, setSlotItemName] = useState('');
  const [slotItemLore, setSlotItemLore] = useState('');

  // Custom metadata form state
  const [newMetaKey, setNewMetaKey] = useState('');
  const [newMetaValue, setNewMetaValue] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedPlayerRowKeys, setSelectedPlayerRowKeys] = useState<React.Key[]>([]);
  const [playerBatchAction, setPlayerBatchAction] = useState<string>('');
  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
    p.uuid.toLowerCase().includes(playerSearch.toLowerCase())
  );

  const [backupSearch, setBackupSearch] = useState('');
  const [selectedBackupRowKeys, setSelectedBackupRowKeys] = useState<React.Key[]>([]);
  const [backupBatchAction, setBackupBatchAction] = useState<string>('');

  // Backups list state — must be declared BEFORE filteredBackups
  const [backups, setBackups] = useState<BackupItem[]>([
    { key: '1', filename: 'backup-daily-2026-08-01.zip', date: '2026-08-01 02:00:00', size: '1.42 GB', type: 'Tự động' },
    { key: '2', filename: 'backup-pre-update-v1.20.4.zip', date: '2026-07-30 18:30:00', size: '1.38 GB', type: 'Thủ công' },
    { key: '3', filename: 'backup-weekly-2026-07-25.zip', date: '2026-07-25 00:00:00', size: '1.35 GB', type: 'Tự động' },
  ]);

  const filteredBackups = backups.filter(b =>
    b.filename.toLowerCase().includes(backupSearch.toLowerCase()) ||
    b.type.toLowerCase().includes(backupSearch.toLowerCase())
  );

  const handleExecutePlayerBatch = () => {
    if (!playerBatchAction) {
      message.warning('Vui lòng chọn thao tác hàng loạt!');
      return;
    }
    if (selectedPlayerRowKeys.length === 0) {
      message.warning('Vui lòng chọn người chơi trước!');
      return;
    }
    message.success(`Đã thực hiện thao tác hàng loạt: ${playerBatchAction.toUpperCase()} cho ${selectedPlayerRowKeys.length} người chơi`);
  };

  const handleExecuteBackupBatch = () => {
    if (!backupBatchAction) {
      message.warning('Vui lòng chọn thao tác hàng loạt!');
      return;
    }
    if (selectedBackupRowKeys.length === 0) {
      message.warning('Vui lòng chọn backup trước!');
      return;
    }
    if (backupBatchAction === 'delete') {
      setBackups(prev => prev.filter(b => !selectedBackupRowKeys.includes(b.key)));
      message.success(`Đã xóa ${selectedBackupRowKeys.length} backup.`);
      setSelectedBackupRowKeys([]);
    } else {
      message.success(`Đã thực hiện thao tác: ${backupBatchAction.toUpperCase()} cho ${selectedBackupRowKeys.length} backup.`);
    }
  };

  // Plugins list state
  const [plugins, setPlugins] = useState<PluginItem[]>([
    { key: '1', name: 'EssentialsX', version: '2.20.1', author: 'TeamCity', size: '3.2 MB', status: true },
    { key: '2', name: 'WorldEdit', version: '7.2.15', author: 'EngineHub', size: '5.8 MB', status: true },
    { key: '3', name: 'Vault', version: '1.7.3', author: 'Slekit', size: '420 KB', status: true },
    { key: '4', name: 'Geyser-Spigot', version: '2.2.0', author: 'GeyserMC', size: '14.5 MB', status: true },
    { key: '5', name: 'ViaVersion', version: '4.9.0', author: 'ViaVersion', size: '4.1 MB', status: true },
    { key: '6', name: 'CoreProtect', version: '22.2', author: 'Intelli', size: '2.9 MB', status: true },
    { key: '7', name: 'LuckPerms', version: '5.4.102', author: 'Luck', size: '6.4 MB', status: true },
  ]);

  // Files list state
  const [serverFiles, setServerFiles] = useState<ServerFileItem[]>([
    { key: '1', name: 'plugins', type: 'folder', size: '32.4 MB', modified: '2026-08-01 02:15', permissions: '0755' },
    { key: '2', name: 'world', type: 'folder', size: '850.2 MB', modified: '2026-08-01 03:45', permissions: '0755' },
    { key: '3', name: 'world_nether', type: 'folder', size: '210.5 MB', modified: '2026-08-01 03:40', permissions: '0755' },
    { key: '4', name: 'world_the_end', type: 'folder', size: '140.1 MB', modified: '2026-08-01 03:30', permissions: '0755' },
    { key: '5', name: 'logs', type: 'folder', size: '15.8 MB', modified: '2026-08-01 03:50', permissions: '0755' },
    { key: '6', name: 'config', type: 'folder', size: '4.2 MB', modified: '2026-07-31 18:20', permissions: '0755' },
    { key: '7', name: 'server.properties', type: 'file', size: '2.4 KB', modified: '2026-08-01 01:10', permissions: '0644' },
    { key: '8', name: 'spigot.yml', type: 'file', size: '8.1 KB', modified: '2026-07-30 14:05', permissions: '0644' },
    { key: '9', name: 'paper-global.yml', type: 'file', size: '12.5 KB', modified: '2026-07-30 14:05', permissions: '0644' },
    { key: '10', name: 'banned-players.json', type: 'file', size: '1.2 KB', modified: '2026-07-28 09:12', permissions: '0644' },
    { key: '11', name: 'ops.json', type: 'file', size: '512 B', modified: '2026-07-29 11:30', permissions: '0644' },
    { key: '12', name: 'whitelist.json', type: 'file', size: '840 B', modified: '2026-07-29 11:30', permissions: '0644' },
    { key: '13', name: 'paper-1.20.4.jar', type: 'file', size: '42.8 MB', modified: '2026-07-20 10:00', permissions: '0755' },
  ]);

  const [editingFile, setEditingFile] = useState<ServerFileItem | null>(null);
  const [fileContent, setFileContent] = useState('');

  // Software Core state
  const [softwareCategory, setSoftwareCategory] = useState<'java' | 'bedrock'>('java');
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({
    paper: '1.20.4',
    purpur: '1.20.4',
    spigot: '1.20.4',
    'vanilla-java': '1.20.4',
    'snapshot-java': '24w06a',
    fabric: '1.20.4',
    neoforge: '20.4.167',
    forge: '1.20.1-47.2.0',
    'vanilla-bedrock': '1.20.60.04',
    'preview-bedrock': '1.20.70.21',
    pocketmine: '5.12.0'
  });
  const [activeCore, setActiveCore] = useState<{ name: string; version: string }>({ name: 'Paper / Bukkit', version: '1.20.4' });
  const [installModalVisible, setInstallModalVisible] = useState(false);
  const [targetSoftware, setTargetSoftware] = useState<SoftwareCore | null>(null);
  const [installing, setInstalling] = useState(false);
  const [installStep, setInstallStep] = useState(0);

  // Full server.properties state (65+ parameters)
  const defaultServerProps = {
    'accepts-transfers': false,
    'allow-flight': false,
    'allow-nether': true,
    'broadcast-console-to-ops': true,
    'broadcast-rcon-to-ops': true,
    'bug-report-link': '',
    'debug': false,
    'difficulty': 'easy',
    'enable-code-of-conduct': false,
    'enable-jmx-monitoring': false,
    'enable-query': false,
    'enable-rcon': false,
    'enable-status': true,
    'enforce-secure-profile': true,
    'enforce-whitelist': false,
    'entity-broadcast-range-percentage': 100,
    'force-gamemode': false,
    'function-permission-level': 2,
    'gamemode': 'survival',
    'generate-structures': true,
    'generator-settings': '{}',
    'hardcore': false,
    'hide-online-players': false,
    'initial-disabled-packs': '',
    'initial-enabled-packs': 'vanilla',
    'level-name': 'world',
    'level-seed': '',
    'level-type': 'minecraft:normal',
    'log-ips': true,
    'management-server-allowed-origins': '',
    'management-server-enabled': false,
    'management-server-host': 'localhost',
    'management-server-port': 0,
    'management-server-secret': 'JrTHs42S9swGvpKw50bRe0GzZizGTtRSrSzfPdRv',
    'management-server-tls-enabled': true,
    'management-server-tls-keystore': '',
    'management-server-tls-keystore-password': '',
    'max-chained-neighbor-updates': 1000000,
    'max-players': 20,
    'max-tick-time': 60000,
    'max-world-size': 29999984,
    'motd': '★ SurvivalSMP Server ★ [1.20.4]',
    'network-compression-threshold': 256,
    'online-mode': false,
    'op-permission-level': 4,
    'pause-when-empty-seconds': -1,
    'player-idle-timeout': 0,
    'prevent-proxy-connections': false,
    'pvp': true,
    'query.port': 30065,
    'rate-limit': 0,
    'rcon.password': '',
    'rcon.port': 25575,
    'region-file-compression': 'deflate',
    'require-resource-pack': false,
    'resource-pack': '',
    'resource-pack-id': '',
    'resource-pack-prompt': '',
    'resource-pack-sha1': '',
    'server-ip': '',
    'server-port': 30065,
    'simulation-distance': 10,
    'spawn-protection': 16,
    'status-heartbeat-interval': 0,
    'sync-chunk-writes': true,
    'text-filtering-config': '',
    'text-filtering-version': 0,
    'use-native-transport': true,
    'view-distance': 10,
    'white-list': false
  };

  const [serverProps, setServerProps] = useState<Record<string, any>>(defaultServerProps);
  const [configSearch, setConfigSearch] = useState('');
  const [configCategory, setConfigCategory] = useState('all');
  const [rawConfigModal, setRawConfigModal] = useState(false);

  const handlePropChange = (key: string, val: any) => {
    setServerProps(prev => ({ ...prev, [key]: val }));
    message.success({ content: `Đã tự động cập nhật: ${key} = ${val}`, key: 'auto_save_prop', duration: 1.5 });
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [ServerProperties]: Realtime updated ${key} = ${val}`]);
  };

  const generateRawProperties = () => {
    return Object.entries(serverProps)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
  };

  // Plugin Marketplace Store state
  const [storeSubTab, setStoreSubTab] = useState<'store' | 'installed'>('store');
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategory, setStoreCategory] = useState<string>('all');
  const [storePlatform, setStorePlatform] = useState<string>('all');
  const [marketplacePlugins, setMarketplacePlugins] = useState<MarketplaceItem[]>(marketplacePluginsList);

  const [pluginSearch, setPluginSearch] = useState('');
  const [selectedPluginRowKeys, setSelectedPluginRowKeys] = useState<React.Key[]>([]);
  const [pluginBatchAction, setPluginBatchAction] = useState<string | null>(null);

  const handleExecutePluginBatch = () => {
    if (!pluginBatchAction) {
      message.warning('Vui lòng chọn thao tác cần thực hiện!');
      return;
    }
    if (selectedPluginRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một plugin!');
      return;
    }
    if (pluginBatchAction === 'enable') {
      setPlugins(prev => prev.map(p => selectedPluginRowKeys.includes(p.key) ? { ...p, status: true } : p));
      message.success(`Đã bật ${selectedPluginRowKeys.length} plugin được chọn.`);
    } else if (pluginBatchAction === 'disable') {
      setPlugins(prev => prev.map(p => selectedPluginRowKeys.includes(p.key) ? { ...p, status: false } : p));
      message.success(`Đã tắt ${selectedPluginRowKeys.length} plugin được chọn.`);
    } else if (pluginBatchAction === 'uninstall') {
      const uninstallNames = plugins.filter(p => selectedPluginRowKeys.includes(p.key)).map(p => p.name);
      setPlugins(prev => prev.filter(p => !selectedPluginRowKeys.includes(p.key)));
      setMarketplacePlugins(prev => prev.map(p => uninstallNames.includes(p.name) ? { ...p, installed: false } : p));
      message.success(`Đã gỡ cài đặt ${selectedPluginRowKeys.length} plugin được chọn.`);
    }
    setSelectedPluginRowKeys([]);
    setPluginBatchAction(null);
  };

  const [installingPlugin, setInstallingPlugin] = useState<MarketplaceItem | null>(null);
  const [installingPluginModal, setInstallingPluginModal] = useState(false);
  const [pluginInstallProgress, setPluginInstallProgress] = useState(0);
  const [pluginInstallStep, setPluginInstallStep] = useState(0);

  const handleInstallPlugin = (item: MarketplaceItem) => {
    setInstallingPlugin(item);
    setInstallingPluginModal(true);
    setPluginInstallProgress(25);
    setPluginInstallStep(1);

    setTimeout(() => {
      setPluginInstallProgress(60);
      setPluginInstallStep(2);
      setTimeout(() => {
        setPluginInstallProgress(90);
        setPluginInstallStep(3);
        setTimeout(() => {
          setPluginInstallProgress(100);
          setPluginInstallStep(4);
          setTimeout(() => {
            setInstallingPluginModal(false);
            setMarketplacePlugins(prev => prev.map(p => p.id === item.id ? { ...p, installed: true } : p));
            setPlugins(prev => [
              ...prev,
              { key: String(prev.length + 1), name: item.name, version: item.version, author: item.author, size: item.size, status: true }
            ]);
            message.success(`Đã cài đặt plugin ${item.name} v${item.version} thành công!`);
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [PluginManager]: Installed ${item.name} v${item.version}`]);
          }, 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleInstallCore = (software: SoftwareCore) => {
    setTargetSoftware(software);
    setInstallModalVisible(true);
    setInstalling(false);
    setInstallStep(0);
  };

  const startInstallation = () => {
    if (!targetSoftware) return;
    setInstalling(true);
    const chosenVer = selectedVersions[targetSoftware.id] || targetSoftware.versions[0].value;

    setInstallStep(1); // Backup
    setTimeout(() => {
      setInstallStep(2); // Download
      setTimeout(() => {
        setInstallStep(3); // Configure
        setTimeout(() => {
          setInstalling(false);
          setInstallModalVisible(false);
          setActiveCore({ name: targetSoftware.name, version: chosenVer });
          message.success(`Đã chuyển đổi thành công sang ${targetSoftware.name} (${chosenVer})!`);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [System]: Server software switched to ${targetSoftware.name} (${chosenVer})`]);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  // Auto-scroll log console
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Dynamic status simulation
  useEffect(() => {
    if (serverState !== 'running') return;
    const interval = setInterval(() => {
      setCpu(+(10 + Math.random() * 8).toFixed(1));
      setRam(+(3.3 + Math.random() * 0.3).toFixed(1));
      setTps(+(19.9 + Math.random() * 0.1).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, [serverState]);

  const handleCopyIp = () => {
    navigator.clipboard.writeText('mc.minepanel.io:25565');
    setCopied(true);
    message.success('Đã sao chép IP máy chủ: mc.minepanel.io:25565');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartServer = () => {
    setServerState('starting');
    message.loading({ content: 'Đang khởi động máy chủ Minecraft...', key: 'server_state' });
    setTimeout(() => {
      setServerState('running');
      message.success({ content: 'Máy chủ Minecraft đã khởi động thành công!', key: 'server_state' });
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [Server thread/INFO]: Server started on port 25565`]);
    }, 2500);
  };

  const handleStopServer = () => {
    setServerState('stopped');
    message.warning('Máy chủ Minecraft đã dừng.');
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [Server thread/INFO]: Stopping the server`]);
  };

  const handleRestartServer = () => {
    setServerState('restarting');
    message.loading({ content: 'Đang khởi động lại máy chủ...', key: 'server_state' });
    setTimeout(() => {
      setServerState('running');
      message.success({ content: 'Máy chủ Minecraft đã khởi động lại hoàn tất!', key: 'server_state' });
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [Server thread/INFO]: Server restarted successfully.`]);
    }, 3000);
  };

  const handleSendCommand = () => {
    if (!commandInput.trim()) return;
    const cmd = commandInput.trim();
    setLogs(prev => [...prev, `> ${cmd}`, `[${new Date().toLocaleTimeString()} INFO]: [Console]: Executed command '${cmd}'`]);
    message.info(`Đã gửi lệnh: ${cmd}`);
    setCommandInput('');
  };

  const handleKickPlayer = (name: string) => {
    setPlayers(prev => prev.filter(p => p.name !== name));
    setOnlineCount(prev => Math.max(0, prev - 1));
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [Server thread/INFO]: Kicked player ${name} from server`]);
    message.success(`Đã kick người chơi ${name} khỏi máy chủ.`);
  };

  const handleToggleOp = (name: string) => {
    setPlayers(prev => prev.map(p => p.name === name ? { ...p, isOp: !p.isOp } : p));
    const player = players.find(p => p.name === name);
    const newStatus = player ? !player.isOp : false;
    message.success(`Đã ${newStatus ? 'cấp quyền OP' : 'tước quyền OP'} cho ${name}`);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: [Server thread/INFO]: ${newStatus ? 'Opped' : 'De-opped'} ${name}`]);
  };

  useEffect(() => {
    if (playerKey) {
      setEditingPlayerKey(playerKey);
    } else {
      setEditingPlayerKey(null);
    }
  }, [playerKey]);

  // Player Detail Panel handlers
  const handleOpenPlayerDetail = (record: Player) => {
    setEditingPlayerKey(record.uuid);
    setDetailActiveTab('status');
    navigate(`${basePath}/players/${record.uuid}`);
  };

  const handleSavePlayerDetail = (updated: PlayerDetail) => {
    setPlayerDetails(prev => ({
      ...prev,
      [updated.uuid]: updated
    }));
    // Sync with main players list by UUID
    setPlayers(prev => prev.map(p => p.uuid === updated.uuid ? {
      ...p,
      dimension: updated.dimension,
      isOp: updated.isOp
    } : p));
  };

  const handleSlotClick = (slotNumber: number, type: 'inventory' | 'enderChest') => {
    if (!editingPlayerKey) return;
    const detail = playerDetails[editingPlayerKey];
    if (!detail) return;

    setEditingSlotType(type);
    setEditingSlotNumber(slotNumber);

    const list = type === 'inventory' ? detail.inventory : detail.enderChest;
    const item = list.find(i => i.slot === slotNumber);

    if (item) {
      setSlotItemId(item.id);
      setSlotItemCount(item.count);
      setSlotItemName(item.name || '');
      setSlotItemLore(item.lore ? item.lore.join('\n') : '');
    } else {
      setSlotItemId('minecraft:diamond_sword');
      setSlotItemCount(1);
      setSlotItemName('');
      setSlotItemLore('');
    }
    setSlotEditorVisible(true);
  };

  const handleSaveSlotItem = () => {
    if (!editingPlayerKey) return;
    const detail = playerDetails[editingPlayerKey];
    if (!detail) return;

    const newItem: InventoryItem = {
      slot: editingSlotNumber,
      id: slotItemId,
      count: slotItemCount,
      ...(slotItemName.trim() ? { name: slotItemName.trim() } : {}),
      ...(slotItemLore.trim() ? { lore: slotItemLore.split('\n').filter(l => l.trim()) } : {})
    };

    const targetList = editingSlotType === 'inventory' ? 'inventory' : 'enderChest';
    const updatedList = [...detail[targetList]].filter(i => i.slot !== editingSlotNumber);
    updatedList.push(newItem);

    const updatedDetail = {
      ...detail,
      [targetList]: updatedList
    };

    handleSavePlayerDetail(updatedDetail);
    setSlotEditorVisible(false);
    message.success(`Đã cập nhật vật phẩm tại ô #${editingSlotNumber}`);
  };

  const handleClearSlotItem = () => {
    if (!editingPlayerKey) return;
    const detail = playerDetails[editingPlayerKey];
    if (!detail) return;

    const targetList = editingSlotType === 'inventory' ? 'inventory' : 'enderChest';
    const updatedList = detail[targetList].filter(i => i.slot !== editingSlotNumber);

    const updatedDetail = {
      ...detail,
      [targetList]: updatedList
    };

    handleSavePlayerDetail(updatedDetail);
    setSlotEditorVisible(false);
    message.info(`Đã làm trống ô #${editingSlotNumber}`);
  };

  const handleAddCustomMeta = () => {
    if (!editingPlayerKey) return;
    const detail = playerDetails[editingPlayerKey];
    if (!detail) return;

    if (!newMetaKey.trim()) {
      message.warning('Tên thuộc tính không được trống!');
      return;
    }

    const key = newMetaKey.trim();
    const value = newMetaValue.trim();

    if (detail.customMeta.some(m => m.key === key)) {
      message.warning('Thuộc tính này đã tồn tại!');
      return;
    }

    const updatedDetail = {
      ...detail,
      customMeta: [...detail.customMeta, { key, value }]
    };

    handleSavePlayerDetail(updatedDetail);
    setNewMetaKey('');
    setNewMetaValue('');
    message.success('Đã thêm thuộc tính tùy chỉnh.');
  };

  const handleDeleteCustomMeta = (key: string) => {
    if (!editingPlayerKey) return;
    const detail = playerDetails[editingPlayerKey];
    if (!detail) return;

    const updatedDetail = {
      ...detail,
      customMeta: detail.customMeta.filter(m => m.key !== key)
    };

    handleSavePlayerDetail(updatedDetail);
    message.info('Đã xóa thuộc tính.');
  };

  // Player action shortcuts
  const triggerPlayerKill = (key: string) => {
    const detail = playerDetails[key];
    if (!detail) return;
    const updated = { ...detail, health: 0 };
    handleSavePlayerDetail(updated);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} WARN]: Player ${detail.name} was killed by administrator command.`]);
    message.error(`Đã tiêu diệt người chơi ${detail.name}!`);
  };

  const triggerPlayerRespawn = (key: string) => {
    const detail = playerDetails[key];
    if (!detail) return;
    const updated = {
      ...detail,
      health: 20,
      food: 20,
      posX: 0,
      posY: 64,
      posZ: 0,
      dimension: 'Overworld'
    };
    handleSavePlayerDetail(updated);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO]: Player ${detail.name} has respawned at Spawn coordinates.`]);
    message.success(`Đã hồi sinh người chơi ${detail.name} tại Spawn!`);
  };

  const triggerPlayerHeal = (key: string) => {
    const detail = playerDetails[key];
    if (!detail) return;
    const updated = { ...detail, health: 20, food: 20 };
    handleSavePlayerDetail(updated);
    message.success(`Đã hồi phục máu và thức ăn tối đa cho ${detail.name}!`);
  };

  const handleCreateBackup = () => {
    const newKey = String(backups.length + 1);
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const filename = `backup-manual-${Date.now().toString().substring(6)}.zip`;
    message.loading({ content: 'Đang nén dữ liệu tạo bản sao lưu mới...', key: 'backup' });
    setTimeout(() => {
      setBackups(prev => [
        { key: newKey, filename, date: dateStr, size: '1.45 GB', type: 'Thủ công' },
        ...prev
      ]);
      message.success({ content: 'Đã tạo bản sao lưu mới thành công!', key: 'backup' });
    }, 1500);
  };

  // SVG Hearts & Hunger rendering helpers
  const renderHearts = (health: number) => {
    const hearts = [];
    for (let i = 0; i < 10; i++) {
      const currentHeartVal = (i * 2) + 2;
      if (health >= currentHeartVal) {
        hearts.push(
          <svg key={i} width="16" height="16" viewBox="0 0 9 9" style={{ marginRight: 1, display: 'inline-block' }}>
            <path d="M1 2h2v1h1V2h2v1h1V2h1v3H7v1H6v1H5v1H4v-1H3v-1H2v-1H1v-3z" fill="#000" />
            <path d="M1 2h1v2H1V2zm1 0h1v3H2V2zm1 1h1v3H3V3zm1 1h1v3H4V4zm1-1h1v3H5V3zm1-1h1v3H6V2zm1 0h1v2H7V2z" fill="#f82424" />
            <path d="M2 2h1v1H2V2zm4 0h1v1H6V2z" fill="#ffffff" />
          </svg>
        );
      } else if (health === currentHeartVal - 1) {
        hearts.push(
          <svg key={i} width="16" height="16" viewBox="0 0 9 9" style={{ marginRight: 1, display: 'inline-block' }}>
            <path d="M1 2h2v1h1V2h2v1h1V2h1v3H7v1H6v1H5v1H4v-1H3v-1H2v-1H1v-3z" fill="#000" />
            <path d="M1 2h1v2H1V2zm1 0h1v3H2V2zm1 1h1v3H3V3zm1 1h1v2H4V4z" fill="#f82424" />
            <path d="M2 2h1v1H2V2z" fill="#ffffff" />
            <path d="M5 3h1v2H5V3zm1-1h1v3H6V2zm1 0h1v2H7V2z" fill="#404040" />
          </svg>
        );
      } else {
        hearts.push(
          <svg key={i} width="16" height="16" viewBox="0 0 9 9" style={{ marginRight: 1, display: 'inline-block' }}>
            <path d="M1 2h2v1h1V2h2v1h1V2h1v3H7v1H6v1H5v1H4v-1H3v-1H2v-1H1v-3z" fill="#000" />
            <path d="M1 2h1v2H1V2zm1 0h1v3H2V2zm1 1h1v3H3V3zm1 1h1v3H4V4zm1-1h1v3H5V3zm1-1h1v3H6V2zm1 0h1v2H7V2z" fill="#404040" />
          </svg>
        );
      }
    }
    return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{hearts}</div>;
  };

  const renderHunger = (food: number) => {
    const shanks = [];
    for (let i = 0; i < 10; i++) {
      const currentFoodVal = (i * 2) + 2;
      if (food >= currentFoodVal) {
        shanks.push(
          <svg key={i} width="16" height="16" viewBox="0 0 9 9" style={{ marginLeft: 1, display: 'inline-block' }}>
            <path d="M4 1h3v1h1v3h-1v1h-1v1h-1v1H4v-1H3v-1H2v-1h1V4h1V1z" fill="#000" />
            <path d="M5 2h2v1H5V2zm0 1h2v1H5V3zm-1 1h3v1H4V4zm0 1h2v1H4V5z" fill="#c26818" />
            <path d="M6 2h1v1H6V2zm0 1h1v1H6V3z" fill="#e89d58" />
            <path d="M1 7h1v1H1V7zm1-1h1v1H2V6z" fill="#e0e0e0" />
          </svg>
        );
      } else if (food === currentFoodVal - 1) {
        shanks.push(
          <svg key={i} width="16" height="16" viewBox="0 0 9 9" style={{ marginLeft: 1, display: 'inline-block' }}>
            <path d="M4 1h3v1h1v3h-1v1h-1v1h-1v1H4v-1H3v-1H2v-1h1V4h1V1z" fill="#000" />
            <path d="M4 4h2v1H4V4zm0 1h1v1H4V5z" fill="#c26818" />
            <path d="M1 7h1v1H1V7zm1-1h1v1H2V6z" fill="#e0e0e0" />
            <path d="M5 2h2v1H5V2zm1 1h1v1H6V3zm0 1h1v1H6V4z" fill="#404040" />
          </svg>
        );
      } else {
        shanks.push(
          <svg key={i} width="16" height="16" viewBox="0 0 9 9" style={{ marginLeft: 1, display: 'inline-block' }}>
            <path d="M4 1h3v1h1v3h-1v1h-1v1h-1v1H4v-1H3v-1H2v-1h1V4h1V1z" fill="#000" />
            <path d="M5 2h2v1H5V2zm-1 1h3v1H4V3zm0 1h3v1H4V4zm0 1h2v1H4V5zm-1 1h1v1H3V6z" fill="#404040" />
            <path d="M1 7h1v1H1V7zm1-1h1v1H2V6z" fill="#707070" />
          </svg>
        );
      }
    }
    return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>{shanks}</div>;
  };

  const getItemIconUrl = (id: string) => {
    const cleanId = id.replace('minecraft:', '');
    const blockIds = ['cobblestone', 'obsidian', 'chest', 'shulker_box'];
    const path = blockIds.includes(cleanId) ? 'block' : 'item';
    return `https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/${path}/${cleanId}.png`;
  };

  const parseMinecraftText = (text: string) => {
    if (!text) return '';
    const parts = text.split(/§[0-9a-fk-or]/g);
    const codes = text.match(/§[0-9a-fk-or]/g) || [];
    
    let currentColor = '#ffffff';
    let isBold = false;
    let isItalic = false;
    
    const colorMap: Record<string, string> = {
      '0': '#000000',
      '1': '#0000aa',
      '2': '#00aa00',
      '3': '#00aaaa',
      '4': '#aa0000',
      '5': '#aa00aa',
      '6': '#ffaa00',
      '7': '#aaaaaa',
      '8': '#555555',
      '9': '#5555ff',
      'a': '#55ff55',
      'b': '#55ffff',
      'c': '#ff5555',
      'd': '#ff55ff',
      'e': '#ffff55',
      'f': '#ffffff',
    };

    return (
      <>
        {parts.map((part, index) => {
          if (index === 0) {
            return part;
          }
          const code = codes[index - 1].charAt(1).toLowerCase();
          if (colorMap[code]) {
            currentColor = colorMap[code];
          } else if (code === 'l') {
            isBold = true;
          } else if (code === 'o') {
            isItalic = true;
          } else if (code === 'r') {
            currentColor = '#ffffff';
            isBold = false;
            isItalic = false;
          }
          return (
            <span
              key={index}
              style={{
                color: currentColor,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal'
              }}
            >
              {part}
            </span>
          );
        })}
      </>
    );
  };

  const renderSlot = (slotNumber: number, type: 'inventory' | 'enderChest', playerDetail: PlayerDetail, key?: any) => {
    const list = type === 'inventory' ? playerDetail.inventory : playerDetail.enderChest;
    const item = list.find(i => i.slot === slotNumber);

    return (
      <Tooltip
        key={key}
        style={{ display: 'block' }}
        overlayStyle={{
          background: 'rgba(16, 0, 16, 0.95)',
          border: '2px solid #2e0066',
          borderRadius: 0,
          padding: '8px 12px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.7), inset 0 0 0 1px #5000ff',
          color: '#ffffff'
        }}
        title={
          item ? (
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.4, pointerEvents: 'none' }}>
              <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>{parseMinecraftText(item.name || item.id)}</div>
              <div style={{ color: '#555555', fontSize: 11, marginBottom: 4 }}>{item.id}</div>
              {item.lore && item.lore.map((line, idx) => (
                <div key={idx} style={{ marginTop: 2, textShadow: '2px 2px 0px #1e003b' }}>{parseMinecraftText(line)}</div>
              ))}
            </div>
          ) : `Ô trống #${slotNumber}`
        }
      >
        <div
          onClick={() => handleSlotClick(slotNumber, type)}
          style={{
            width: 36,
            height: 36,
            backgroundColor: '#8b8b8b',
            border: '1px solid #373737',
            boxShadow: 'inset -2px -2px 0px #ffffff, inset 2px 2px 0px #555555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            boxSizing: 'border-box',
            imageRendering: 'pixelated',
          }}
        >
          {item ? (
            <>
              <img
                src={getItemIconUrl(item.id)}
                alt={item.id}
                style={{ width: 32, height: 32, imageRendering: 'pixelated' }}
                onError={(e) => {
                  (e.target as any).src = 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/block/chest_front.png';
                }}
              />
              {item.count > 1 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 2,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    textShadow: '2px 2px 0px #000000',
                    pointerEvents: 'none',
                  }}
                >
                  {item.count}
                </span>
              )}
            </>
          ) : null}
        </div>
      </Tooltip>
    );
  };

  const renderInventoryTab = (detail: PlayerDetail) => {
    const isCreative = detail.gamemode === 'creative';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
          {/* Main Inventory Panel (Minecraft GUI Classic Style) */}
          <div 
            style={{ 
              display: 'inline-flex',
              flexDirection: 'column',
              backgroundColor: '#c6c6c6', 
              border: '3px solid',
              borderColor: '#dbdbdb #555555 #555555 #dbdbdb', // classic bevel highlights/shadows
              boxShadow: 'inset -2px -2px 0px #373737, inset 2px 2px 0px #ffffff',
              padding: 16,
              boxSizing: 'border-box',
              borderRadius: 0
            }}
          >
            {/* Top Half: Equipment & Avatar display */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 12 }}>
              {isCreative ? (
                // Creative Mode Layout
                <div style={{ display: 'grid', gridTemplateColumns: '36px 72px 36px', gridTemplateRows: '36px 76px 36px', gap: '4px 8px', justifyContent: 'center', alignItems: 'center' }}>
                  {/* Column 1 (Left) */}
                  <div style={{ gridColumn: 1, gridRow: 2, display: 'flex', justifyContent: 'center' }}>
                    {renderSlot(40, 'inventory', detail, 'offhand')} {/* Shield (Off-hand) */}
                  </div>

                  {/* Column 2 (Middle) */}
                  <div style={{ gridColumn: 2, gridRow: 1, display: 'flex', justifyContent: 'center' }}>
                    {renderSlot(39, 'inventory', detail, 'helmet')} {/* Helmet */}
                  </div>
                  <div style={{ 
                    gridColumn: 2, 
                    gridRow: 2, 
                    backgroundColor: '#000000', 
                    border: '1px solid #373737',
                    boxShadow: 'inset -2px -2px 0px #ffffff, inset 2px 2px 0px #555555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    width: 72,
                    height: 76
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(https://mc-heads.net/body/${detail.name}/100)`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      imageRendering: 'pixelated'
                    }} />
                  </div>
                  <div style={{ gridColumn: 2, gridRow: 3, display: 'flex', justifyContent: 'center' }}>
                    {renderSlot(38, 'inventory', detail, 'chestplate')} {/* Chestplate */}
                  </div>

                  {/* Column 3 (Right) */}
                  <div style={{ gridColumn: 3, gridRow: 2, height: 76, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {renderSlot(37, 'inventory', detail, 'leggings')} {/* Leggings */}
                    {renderSlot(36, 'inventory', detail, 'boots')} {/* Boots */}
                  </div>
                </div>
              ) : (
                // Survival Mode Layout
                <>
                  {/* Left Column: Armor slots */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {renderSlot(39, 'inventory', detail, 'helmet')}
                    {renderSlot(38, 'inventory', detail, 'chestplate')}
                    {renderSlot(37, 'inventory', detail, 'leggings')}
                    {renderSlot(36, 'inventory', detail, 'boots')}
                  </div>

                  {/* Center Column: Avatar Frame */}
                  <div style={{ 
                    width: 72, 
                    height: 156, 
                    backgroundColor: '#000000', 
                    border: '1px solid #373737',
                    boxShadow: 'inset -2px -2px 0px #ffffff, inset 2px 2px 0px #555555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(https://mc-heads.net/body/${detail.name}/180)`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      imageRendering: 'pixelated'
                    }} />
                  </div>

                  {/* Right Column: Off-hand slot at bottom, empty at top */}
                  <div style={{ display: 'flex', flexDirection: 'column', height: 156, justifyContent: 'flex-end', gap: 4 }}>
                    {renderSlot(40, 'inventory', detail, 'offhand')}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Half: Main Inventory Grid (3x9) */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0,
                border: '1px solid #373737',
                backgroundColor: '#373737',
                width: 'fit-content'
              }}
            >
              {[0, 1, 2].map(row => (
                <div key={row} style={{ display: 'flex', gap: 0 }}>
                  {Array.from({ length: 9 }).map((_, col) => {
                    const slotNum = 9 + (row * 9) + col;
                    return renderSlot(slotNum, 'inventory', detail, `inv-${row}-${col}`);
                  })}
                </div>
              ))}
            </div>

            {/* Divider line */}
            <div style={{ height: 2, borderTop: '2px solid #555555', borderBottom: '2px solid #ffffff', margin: '6px 0' }} />

            {/* Hotbar Grid (1x9) */}
            <div 
              style={{ 
                display: 'flex', 
                gap: 0,
                border: '1px solid #373737',
                backgroundColor: '#373737',
                width: 'fit-content'
              }}
            >
              {Array.from({ length: 9 }).map((_, col) => {
                return renderSlot(col, 'inventory', detail, `hotbar-${col}`);
              })}
            </div>
          </div>

          {/* Active Potion Effects Panel (matches right side of screenshot) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: 260,
            backgroundColor: '#101010',
            border: '2px solid #3c3c3c',
            borderRadius: 0,
            padding: '12px 16px',
            color: '#ffffff',
            fontFamily: 'monospace',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 0,
                backgroundColor: '#1d102e',
                border: '1px solid #7c26c6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 0 5px rgba(124, 38, 198, 0.5)'
              }}>
                👁️
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 'bold', textShadow: '2px 2px 0px #000000', color: '#ffffff' }}>Nhìn trong bóng tối</div>
                <div style={{ fontSize: 11, color: '#aaaaaa', marginTop: 2, textShadow: '1px 1px 0px #000000' }}>∞</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ender Chest Section (keep original layout but styled clean) */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: 'rgba(0, 0, 0, 0.85)' }}>Rương Ender (Ender Chest - 27 ô)</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 0, padding: 8, background: '#8f4f9f', borderRadius: 0, border: '2px solid #2f1835', boxShadow: 'inset -2px -2px 0px #1a0c1e, inset 2px 2px 0px #bf7fcf' }}>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0,
                border: '1px solid #373737',
                backgroundColor: '#373737',
                width: 'fit-content'
              }}
            >
              {[0, 1, 2].map(row => (
                <div key={row} style={{ display: 'flex', gap: 0 }}>
                  {Array.from({ length: 9 }).map((_, col) => {
                    const slotNum = (row * 9) + col;
                    return renderSlot(slotNum, 'enderChest', detail, `ender-${row}-${col}`);
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const detail = editingPlayerKey ? playerDetails[editingPlayerKey] : null;

  if (playerKey && detail) {
    return (
      <div style={{ width: '100%', padding: '16px 0' }}>
        {/* Header Back & Info Section (Frameless) */}
        <div
          style={{
            marginBottom: 20,
            paddingBottom: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <Space size="middle" align="center">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(`${basePath}/players`)}
                style={{ borderRadius: 6 }}
              >
                Quay lại
              </Button>
              <Avatar size={40} style={{ backgroundColor: '#009688' }} icon={<UserOutlined />} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Title level={4} style={{ margin: 0 }}>{detail.name}</Title>
                  <Tag color={detail.isOp ? 'red' : 'blue'}>{detail.isOp ? 'OP' : 'Member'}</Tag>
                  <Tag color="cyan">{detail.dimension}</Tag>
                </div>
                <div style={{ marginTop: 2 }}>
                  <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>UUID: {detail.uuid}</Text>
                  <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                  <Text type="secondary" style={{ fontSize: 11 }}>Ping: </Text>
                  <Tag color={detail.ping < 40 ? 'green' : 'orange'} style={{ fontSize: 10, padding: '0 4px', height: 16, lineHeight: '14px', margin: 0 }}>{detail.ping} ms</Tag>
                  <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                  <Text type="secondary" style={{ fontSize: 11 }}>Thời gian chơi: {detail.playtime}</Text>
                </div>
              </div>
            </Space>
          </div>
        </div>

        {/* Custom Tab buttons directly on page */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, paddingBottom: 12 }}>
          <Button
            type={detailActiveTab === 'status' ? 'primary' : 'default'}
            onClick={() => setDetailActiveTab('status')}
            style={detailActiveTab === 'status' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
          >
            Chỉ số & Trạng thái
          </Button>
          <Button
            type={detailActiveTab === 'inventory' ? 'primary' : 'default'}
            onClick={() => setDetailActiveTab('inventory')}
            style={detailActiveTab === 'inventory' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
          >
            Túi đồ & Rương Ender
          </Button>
          <Button
            type={detailActiveTab === 'custom' ? 'primary' : 'default'}
            onClick={() => setDetailActiveTab('custom')}
            style={detailActiveTab === 'custom' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
          >
            Dữ liệu Tùy chỉnh (Meta)
          </Button>
        </div>

        {/* Tab Content 1: Status & Overview */}
        {detailActiveTab === 'status' && (
          <div style={{ padding: '8px 0' }}>
            {/* Visual Hearts & Hunger */}
            <div style={{ marginBottom: 20, borderRadius: 8, background: '#fafafa', padding: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 13 }}>Sinh mệnh (Health: {detail.health}/20 HP)</Text>
                    <div style={{ display: 'flex', alignItems: 'center', height: 24 }}>
                      {renderHearts(detail.health)}
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 13 }}>Thức ăn (Hunger: {detail.food}/20)</Text>
                    <div style={{ display: 'flex', alignItems: 'center', height: 24, justifyContent: 'flex-end' }}>
                      {renderHunger(detail.food)}
                    </div>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* Status Form */}
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Form.Item label="Chế độ chơi (Game Mode)">
                    <Select
                      value={detail.gamemode}
                      onChange={(val: any) => handleSavePlayerDetail({ ...detail, gamemode: val })}
                      options={[
                        { label: 'Sinh tồn (Survival)', value: 'survival' },
                        { label: 'Sáng tạo (Creative)', value: 'creative' },
                        { label: 'Phiêu lưu (Adventure)', value: 'adventure' },
                        { label: 'Khán giả (Spectator)', value: 'spectator' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label="Máu hiện tại (HP)">
                    <InputNumber
                      min={0}
                      max={20}
                      value={detail.health}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, health: val || 0 })}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label="Độ no (Food)">
                    <InputNumber
                      min={0}
                      max={20}
                      value={detail.food}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, food: val || 0 })}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Form.Item label="Cấp độ XP (Level)">
                    <InputNumber
                      min={0}
                      value={detail.xpLevel}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, xpLevel: val || 0 })}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label="Tiến trình XP (0.0 - 1.0)">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={detail.xpProgress}
                        onChange={(e) => handleSavePlayerDetail({ ...detail, xpProgress: parseFloat(e.target.value) })}
                        style={{ flex: 1 }}
                      />
                      <Text style={{ minWidth: 35 }}>{Math.round(detail.xpProgress * 100)}%</Text>
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Thế giới (Dimension)">
                    <Select
                      value={detail.dimension}
                      onChange={(val: any) => handleSavePlayerDetail({ ...detail, dimension: val })}
                      options={[
                        { label: 'Overworld (Thế giới thường)', value: 'Overworld' },
                        { label: 'Nether (Địa Ngục)', value: 'Nether' },
                        { label: 'The End (Thế giới kết thúc)', value: 'The End' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={8}>
                  <Form.Item label="Tọa độ X">
                    <InputNumber
                      value={detail.posX}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, posX: val || 0 })}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={8}>
                  <Form.Item label="Tọa độ Y">
                    <InputNumber
                      value={detail.posY}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, posY: val || 0 })}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={8}>
                  <Form.Item label="Tọa độ Z">
                    <InputNumber
                      value={detail.posZ}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, posZ: val || 0 })}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Form.Item label="Chế độ Bay (Fly Mode)">
                    <Switch
                      checked={detail.flyMode}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, flyMode: val })}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item label="Bất tử (God Mode)">
                    <Switch
                      checked={detail.godMode}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, godMode: val })}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item label="Quyền Quản trị (OP)">
                    <Switch
                      checked={detail.isOp}
                      onChange={(val) => handleSavePlayerDetail({ ...detail, isOp: val })}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '16px 0', width: '100%' }} />

            {/* Command Shortcuts */}
            <Space size="middle" wrap>
              <Button type="primary" onClick={() => triggerPlayerHeal(detail.uuid)} style={{ backgroundColor: '#2e7d32', borderColor: '#2e7d32' }}>
                Hồi máu & Đồ ăn tối đa
              </Button>
              <Button type="primary" danger onClick={() => triggerPlayerKill(detail.uuid)}>
                Tiêu diệt (Kill)
              </Button>
              <Button onClick={() => triggerPlayerRespawn(detail.uuid)}>
                Hồi sinh về Spawn
              </Button>
              <Button
                onClick={() => {
                  const updated = { ...detail, posX: 0, posY: 64, posZ: 0 };
                  handleSavePlayerDetail(updated);
                  message.success('Đã dịch chuyển tọa độ về 0, 64, 0.');
                }}
              >
                Dịch chuyển tới Spawn
              </Button>
            </Space>
          </div>
        )}

        {/* Tab Content 2: Inventory & Ender Chest */}
        {detailActiveTab === 'inventory' && (
          <div style={{ padding: '8px 0' }}>
            {renderInventoryTab(detail)}
          </div>
        )}

        {/* Tab Content 3: Custom Metadata */}
        {detailActiveTab === 'custom' && (
          <div style={{ padding: '8px 0' }}>
            <Table
              dataSource={detail.customMeta}
              size="small"
              pagination={false}
              rowKey="key"
              columns={[
                { title: 'Khóa (Key)', dataIndex: 'key', key: 'key', render: (k) => <Text strong>{k}</Text> },
                {
                  title: 'Giá trị (Value)',
                  dataIndex: 'value',
                  key: 'value',
                  render: (v, mRecord) => (
                    <Input
                      value={v}
                      onChange={(e) => {
                        const updatedMeta = detail.customMeta.map(m => m.key === mRecord.key ? { ...m, value: e.target.value } : m);
                        handleSavePlayerDetail({ ...detail, customMeta: updatedMeta });
                      }}
                      style={{ width: '80%' }}
                    />
                  )
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, mRecord) => (
                    <Button size="small" danger onClick={() => handleDeleteCustomMeta(mRecord.key)}>
                      Xóa
                    </Button>
                  )
                }
              ]}
              style={{ marginBottom: 20 }}
            />

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 12, color: 'rgba(0, 0, 0, 0.85)' }}>Thêm thuộc tính tùy chỉnh mới</div>
              <Row gutter={8} align="middle">
                <Col span={10}>
                  <Input placeholder="Tên thuộc tính (Ví dụ: coins, level_boss)" value={newMetaKey} onChange={e => setNewMetaKey(e.target.value)} />
                </Col>
                <Col span={10}>
                  <Input placeholder="Giá trị" value={newMetaValue} onChange={e => setNewMetaValue(e.target.value)} />
                </Col>
                <Col span={4}>
                  <Button type="primary" onClick={handleAddCustomMeta} style={{ backgroundColor: '#009688', borderColor: '#009688', width: '100%' }}>
                    Thêm
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        )}

        {/* Slot Item Editor Modal is kept locally here */}
        <Modal
          title={`Chỉnh sửa Vật phẩm - Ô số #${editingSlotNumber} (${editingSlotType === 'inventory' ? 'Túi đồ' : 'Rương Ender'})`}
          open={slotEditorVisible}
          onCancel={() => setSlotEditorVisible(false)}
          footer={[
            <Button key="clear" danger onClick={handleClearSlotItem} style={{ float: 'left' }}>
              Làm trống ô đồ
            </Button>,
            <Button key="close" onClick={() => setSlotEditorVisible(false)}>
              Hủy
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveSlotItem} style={{ backgroundColor: '#009688', borderColor: '#009688' }}>
              Lưu vật phẩm
            </Button>,
          ]}
          width={500}
          bodyStyle={{ overflow: 'visible' }}
        >
          <Form layout="vertical" style={{ marginTop: 12 }}>
            <Form.Item label="Chọn Vật phẩm">
              <Select
                showSearch
                value={slotItemId}
                onChange={setSlotItemId}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={MC_ITEMS_CATALOG.map(item => ({
                  value: item.id,
                  label: item.label
                }))}
                placeholder="Chọn vật phẩm từ danh mục..."
                style={{ width: '100%' }}
              />
              <div style={{ marginTop: 8 }}>
                <Input
                  placeholder="Hoặc tự gõ ID tùy chọn (ví dụ: minecraft:stone)"
                  value={slotItemId}
                  onChange={e => setSlotItemId(e.target.value)}
                />
              </div>
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Số lượng (1 - 64)">
                  <InputNumber
                    min={1}
                    max={64}
                    value={slotItemCount}
                    onChange={v => setSlotItemCount(v || 1)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên tùy chỉnh (Display Name)">
                  <Input
                    placeholder="Để trống để dùng tên gốc"
                    value={slotItemName}
                    onChange={e => setSlotItemName(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Dòng chú thích (Lore) - Mỗi dòng một dòng riêng biệt">
              <Input.TextArea
                rows={4}
                placeholder="Mỗi dòng lore nhập trên một dòng khác nhau"
                value={slotItemLore}
                onChange={e => setSlotItemLore(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div style={activeTab === 'files' ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' } : { width: '100%' }}>
      {/* Main Tabs Navigation */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        hideHeader
        items={[
            {
              key: 'overview',
              label: 'Tổng quan',
              children: (
                <div style={{ paddingTop: 12 }}>
                  {/* Header Banner Card */}
                  <Card
                    style={{
                      borderRadius: 8,
                      marginBottom: 16,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fbfb 100%)',
                      border: '1px solid #e0e0e0'
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <Row gutter={[16, 16]} align="middle" justify="space-between">
                      <Col xs={24} md={15}>
                        <Space align="center" size="middle">
                          <div style={{
                            width: 52,
                            height: 52,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #009688 0%, #00796B 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(0,150,136,0.3)',
                            flexShrink: 0
                          }}>
                            <RocketOutlined style={{ fontSize: 26, color: '#fff' }} />
                          </div>
                          <div>
                            <Space align="center" wrap style={{ marginBottom: 4 }}>
                              <Title level={4} style={{ margin: 0 }}>SurvivalSMP Server</Title>
                              <Tag
                                color={serverState === 'running' ? 'success' : serverState === 'stopped' ? 'error' : 'warning'}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, padding: '2px 8px' }}
                              >
                                {serverState === 'running' ? (
                                  <>
                                    <CheckCircleOutlined /> ONLINE
                                  </>
                                ) : serverState === 'stopped' ? (
                                  <>
                                    <CloseCircleOutlined /> OFFLINE
                                  </>
                                ) : (
                                  <>
                                    <SyncOutlined spin /> RESTARTING
                                  </>
                                )}
                              </Tag>
                            </Space>
                            <Space align="center" wrap style={{ marginTop: 4 }}>
                              <Text type="secondary">IP Kết nối:</Text>
                              <Text code style={{ fontWeight: 600, color: '#009688', margin: 0 }}>
                                mc.minepanel.io:25565
                              </Text>
                              <Button
                                size="small"
                                icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
                                onClick={handleCopyIp}
                                style={{ color: '#009688', borderColor: '#009688', borderRadius: 4, marginLeft: 4 }}
                              >
                                {copied ? 'Đã sao chép' : 'Sao chép IP'}
                              </Button>
                            </Space>
                          </div>
                        </Space>
                      </Col>

                      <Col xs={24} md={9} style={{ textAlign: 'right' }}>
                        <Space wrap>
                          {serverState === 'stopped' ? (
                            <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleStartServer} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                              Khởi động
                            </Button>
                          ) : (
                            <Button icon={<StopOutlined />} onClick={handleStopServer} danger>
                              Tắt máy chủ
                            </Button>
                          )}
                          <Button icon={<ReloadOutlined />} onClick={handleRestartServer} disabled={serverState === 'stopped'}>
                            Khởi động lại
                          </Button>
                          <Popconfirm title="Bạn có chắc chắn muốn ép dừng ngay lập tức?" onConfirm={handleStopServer} okText="Ép dừng" cancelText="Hủy">
                            <Button icon={<PoweroffOutlined />} type="dashed" danger disabled={serverState === 'stopped'}>
                              Ép dừng (Kill)
                            </Button>
                          </Popconfirm>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                      <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 6 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Tốc độ xử lý (TPS)</Text>
                        <Title level={3} style={{ margin: '4px 0 0', color: '#52c41a' }}>{tps} <Text style={{ fontSize: 14, color: '#52c41a' }}>/ 20.0</Text></Title>
                        <Progress percent={+(tps / 20 * 100).toFixed(0)} strokeColor="#52c41a" showInfo={false} size="small" style={{ marginTop: 8 }} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Card size="small" style={{ background: '#e6f7ff', borderColor: '#91caff', borderRadius: 6 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Người chơi online</Text>
                        <Title level={3} style={{ margin: '4px 0 0', color: '#1677ff' }}>{onlineCount} <Text style={{ fontSize: 14, color: '#1677ff' }}>/ {maxPlayers}</Text></Title>
                        <Progress percent={+(onlineCount / maxPlayers * 100).toFixed(0)} strokeColor="#1677ff" showInfo={false} size="small" style={{ marginTop: 8 }} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Card size="small" style={{ background: '#fff7e6', borderColor: '#ffd591', borderRadius: 6 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>CPU Sử dụng</Text>
                        <Title level={3} style={{ margin: '4px 0 0', color: '#fa8c16' }}>{cpu}%</Title>
                        <Progress percent={cpu} strokeColor="#fa8c16" showInfo={false} size="small" style={{ marginTop: 8 }} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Card size="small" style={{ background: '#f9f0ff', borderColor: '#d3ade6', borderRadius: 6 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>RAM Sử dụng</Text>
                        <Title level={3} style={{ margin: '4px 0 0', color: '#722ed1' }}>{ram} GB <Text style={{ fontSize: 14, color: '#722ed1' }}>/ {maxRam} GB</Text></Title>
                        <Progress percent={+(ram / maxRam * 100).toFixed(0)} strokeColor="#722ed1" showInfo={false} size="small" style={{ marginTop: 8 }} />
                      </Card>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} md={14}>
                      <Card title={<Space><ToolOutlined />Thông tin chi tiết máy chủ</Space>} size="small" style={{ borderRadius: 6 }}>
                        <Row gutter={[12, 12]}>
                          <Col span={12}><Text type="secondary">Core Engine:</Text> <Text strong>PaperMC 1.20.4</Text></Col>
                          <Col span={12}><Text type="secondary">Môi trường Java:</Text> <Text strong>Java 21 (OpenJDK)</Text></Col>
                          <Col span={12}><Text type="secondary">Cổng mạng (Port):</Text> <Text strong>25565 (TCP/UDP)</Text></Col>
                          <Col span={12}><Text type="secondary">Cổng RCON:</Text> <Text strong>25575</Text></Col>
                          <Col span={12}><Text type="secondary">Uptime:</Text> <Text strong>4 ngày 12 giờ 35 phút</Text></Col>
                          <Col span={12}><Text type="secondary">Thế giới chính:</Text> <Text strong>world (Overworld)</Text></Col>
                          <Col span={12}><Text type="secondary">Chế độ kiểm duyệt:</Text> <Tag color="blue">Online Mode (Premium)</Tag></Col>
                          <Col span={12}><Text type="secondary">Whitelist:</Text> <Tag color="default">Đã tắt</Tag></Col>
                        </Row>

                        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Tham số khởi chạy Java (JVM Arguments):</Text>
                          <div style={{ background: '#272822', color: '#f8f8f2', padding: '8px 12px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12, marginTop: 4 }}>
                            java -Xmx8192M -Xms2048M -XX:+UseG1GC -jar paper-1.20.4.jar nogui
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={10}>
                      <Card title={<Space><SafetyCertificateOutlined />Xem trước Tiêu đề máy chủ (MOTD)</Space>} size="small" style={{ borderRadius: 6 }}>
                        <div style={{ background: '#111', padding: 12, borderRadius: 6, color: '#fff', fontFamily: 'monospace', fontSize: 13, border: '1px solid #333' }}>
                          <div style={{ color: '#55FF55', fontWeight: 'bold' }}>★ SurvivalSMP Server ★ [1.20.4]</div>
                          <div style={{ color: '#FFFF55', marginTop: 4 }}>Chào mừng bạn đến với Server Minecraft Minepanel!</div>
                        </div>
                        <Alert message="Có thể chỉnh sửa tiêu đề MOTD và mã màu Minecraft tại tab Cấu hình." type="info" showIcon style={{ marginTop: 12 }} />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'software',
              label: 'Phần mềm',
              children: (() => {
                const activeCoreItem = softwareCoresList.find(s => 
                  activeCore.name.toLowerCase().includes(s.id) || 
                  s.id.toLowerCase().includes(activeCore.name.toLowerCase()) ||
                  activeCore.name.toLowerCase() === s.name.toLowerCase()
                );
                const activeCoreCategory = activeCoreItem ? activeCoreItem.category : 'java';

                return (
                  <div style={{ paddingTop: 12 }}>
                    {/* Sub Category Selector */}
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size="small">
                        <Button
                          type={softwareCategory === 'java' ? 'primary' : 'default'}
                          onClick={() => setSoftwareCategory('java')}
                          icon={<CoffeeOutlined />}
                          style={softwareCategory === 'java' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
                        >
                          Java Edition
                        </Button>
                        <Button
                          type={softwareCategory === 'bedrock' ? 'primary' : 'default'}
                          onClick={() => setSoftwareCategory('bedrock')}
                          icon={<MobileOutlined />}
                          style={softwareCategory === 'bedrock' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
                        >
                          Bedrock Edition
                        </Button>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>Tự động tìm tất cả các phiên bản & phần mềm khác để cài đặt</Text>
                    </div>

                    {activeCoreCategory !== softwareCategory && (
                      <Alert
                        message="Cảnh báo: Khác phiên bản máy chủ"
                        description={`Máy chủ hiện tại của bạn đang sử dụng ${activeCore.name} (${activeCoreCategory === 'java' ? 'Java Edition' : 'Bedrock Edition'}). Việc chuyển đổi sang và cài đặt phần mềm của ${softwareCategory === 'java' ? 'Java Edition' : 'Bedrock Edition'} sẽ XÓA SẠCH toàn bộ dữ liệu hiện có (thế giới, cấu hình, plugin/addon) của máy chủ cũ!`}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    )}

                    {/* Grid of Software Cores */}
                    <Row gutter={[16, 16]}>
                      {softwareCoresList.filter(s => s.category === softwareCategory).map(core => {
                        const chosenVer = selectedVersions[core.id] || core.versions[0].value;
                        const isInstalled = (activeCore.name.toLowerCase().includes(core.id) || 
                                             core.id.toLowerCase().includes(activeCore.name.toLowerCase()) ||
                                             activeCore.name.toLowerCase() === core.name.toLowerCase()) && 
                                            activeCore.version === chosenVer;
                        return (
                          <Col xs={24} sm={12} lg={8} key={core.id}>
                            <Card
                              hoverable
                              size="small"
                              style={{
                                borderRadius: 8,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderColor: '#e0e0e0',
                                borderWidth: 1,
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                  <Space align="center">
                                    {core.icon}
                                    <div>
                                      <Text strong style={{ fontSize: 15 }}>{core.name}</Text>
                                      <div><Tag color="blue" style={{ fontSize: 10, margin: 0 }}>{core.type}</Tag></div>
                                    </div>
                                  </Space>
                                  {core.recommended && <Tag color="gold">Khuyên dùng</Tag>}
                                </div>

                                <Paragraph type="secondary" style={{ fontSize: 12, minHeight: 36, marginBottom: 12 }}>
                                  {core.desc}
                                </Paragraph>
                              </div>

                              <div style={{ marginTop: 'auto', width: '100%' }}>
                                <div style={{ marginBottom: 8 }}>
                                  <Select
                                    style={{ width: '100%' }}
                                    value={chosenVer}
                                    onChange={(val) => {
                                      setSelectedVersions(prev => ({ ...prev, [core.id]: val }));
                                    }}
                                    options={core.versions}
                                  />
                                </div>
                                {isInstalled ? (
                                  <Button disabled block icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} style={{ borderRadius: 6 }}>
                                    Đã cài đặt
                                  </Button>
                                ) : (
                                  <Button
                                    type="primary"
                                    block
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleInstallCore(core)}
                                    style={{ backgroundColor: '#009688', borderColor: '#009688', borderRadius: 6 }}
                                  >
                                    Cài đặt phiên bản
                                  </Button>
                                )}
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                );
              })()
            },
            {
              key: 'console',
              label: 'Dòng lệnh',
              children: (
                <div style={{ paddingTop: 12 }}>
                  <Card size="small" style={{ background: '#1e1e1e', borderColor: '#333', borderRadius: 8, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
                    {/* Log Terminal Window */}
                    <div
                      ref={logContainerRef}
                      style={{
                        height: 'calc(100vh - 365px)',
                        minHeight: 350,
                        overflowY: 'auto',
                        padding: 16,
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: 13,
                        lineHeight: '1.6',
                        color: '#d4d4d4',
                        background: '#1e1e1e'
                      }}
                    >
                      {logs.map((log, index) => (
                        <div key={index} style={{
                          color: log.startsWith('>') ? '#4ec9b0' : log.includes('ERROR') ? '#f14c4c' : log.includes('WARN') ? '#cca700' : '#d4d4d4'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Command Input Bar */}
                    <div style={{ padding: '12px 16px', background: '#1e1e1e', borderTop: 'none', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Input
                        placeholder="Nhập lệnh Minecraft (VD: op player, say Hello, whitelist add name...)"
                        value={commandInput}
                        onChange={e => setCommandInput(e.target.value)}
                        onPressEnter={handleSendCommand}
                        prefix={<Text style={{ color: '#009688', fontWeight: 'bold', marginRight: 4 }}>&gt;</Text>}
                        style={{ background: '#252526', borderColor: '#3c3c3c', color: '#ffffff', borderRadius: 6, height: 36 }}
                      />
                      <Button type="primary" icon={<SendOutlined />} onClick={handleSendCommand} style={{ backgroundColor: '#009688', borderColor: '#009688', borderRadius: 6, height: 36 }}>
                        Gửi lệnh
                      </Button>
                    </div>
                  </Card>
                </div>
              )
            },
            {
              key: 'config',
              label: 'Cấu hình',
              children: (
                <div style={{ paddingTop: 12 }}>
                  {/* Action Bar & Search Header */}
                  <div style={{ marginBottom: 16 }}>
                    <Row gutter={[12, 12]} align="middle" justify="space-between">
                      <Col xs={24} md={10}>
                        <Input
                          prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                          placeholder="Tìm kiếm tham số cấu hình (motd, port, view-distance, rcon...)..."
                          value={configSearch}
                          onChange={e => setConfigSearch(e.target.value)}
                          allowClear
                        />
                      </Col>

                      <Col xs={24} md={14} style={{ textAlign: 'right' }}>
                        <Space flexWrap="wrap" size="small" align="center">
                          <Tag color="green" icon={<CheckCircleOutlined />} style={{ padding: '4px 10px', fontSize: 13, borderRadius: 6, margin: 0 }}>
                            Tự động lưu real-time
                          </Tag>
                          <Button
                            icon={<FileTextOutlined />}
                            onClick={() => setRawConfigModal(true)}
                          >
                            Xem tệp thô (.properties)
                          </Button>
                          <Button
                            icon={<UndoOutlined />}
                            onClick={() => {
                              setServerProps(defaultServerProps);
                              message.info('Đã khôi phục tất cả thông số về mặc định!');
                            }}
                          >
                            Khôi phục mặc định
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>

                  <Form layout="vertical">
                    <Row gutter={[16, 12]}>
                      {/* motd */}
                      {(!configSearch || 'motd'.includes(configSearch.toLowerCase()) || 'tên server'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24} md={12}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Tên Server (MOTD) <Tag style={{ fontSize: 10 }}>motd</Tag></Text>}>
                            <Input value={serverProps['motd']} onChange={e => handlePropChange('motd', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* server-port */}
                      {(!configSearch || 'server-port'.includes(configSearch.toLowerCase()) || 'cổng'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cổng Máy chủ <Tag style={{ fontSize: 10 }}>server-port</Tag></Text>}>
                            <InputNumber min={1} max={65535} value={serverProps['server-port']} onChange={v => handlePropChange('server-port', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* server-ip */}
                      {(!configSearch || 'server-ip'.includes(configSearch.toLowerCase()) || 'ip'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>IP Binding <Tag style={{ fontSize: 10 }}>server-ip</Tag></Text>}>
                            <Input value={serverProps['server-ip']} placeholder="0.0.0.0" onChange={e => handlePropChange('server-ip', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* max-players */}
                      {(!configSearch || 'max-players'.includes(configSearch.toLowerCase()) || 'người chơi'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Số người chơi tối đa <Tag style={{ fontSize: 10 }}>max-players</Tag></Text>}>
                            <InputNumber min={1} max={10000} value={serverProps['max-players']} onChange={v => handlePropChange('max-players', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* online-mode */}
                      {(!configSearch || 'online-mode'.includes(configSearch.toLowerCase()) || 'mojang'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Xác thực Mojang Premium <Tag style={{ fontSize: 10 }}>online-mode</Tag></Text>}>
                            <Switch checked={serverProps['online-mode']} onChange={v => handlePropChange('online-mode', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* prevent-proxy-connections */}
                      {(!configSearch || 'prevent-proxy-connections'.includes(configSearch.toLowerCase()) || 'proxy'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cấm Proxy/VPN <Tag style={{ fontSize: 10 }}>prevent-proxy-connections</Tag></Text>}>
                            <Switch checked={serverProps['prevent-proxy-connections']} onChange={v => handlePropChange('prevent-proxy-connections', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* log-ips */}
                      {(!configSearch || 'log-ips'.includes(configSearch.toLowerCase()) || 'log'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Ghi log địa chỉ IP <Tag style={{ fontSize: 10 }}>log-ips</Tag></Text>}>
                            <Switch checked={serverProps['log-ips']} onChange={v => handlePropChange('log-ips', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* use-native-transport */}
                      {(!configSearch || 'use-native-transport'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Native Transport <Tag style={{ fontSize: 10 }}>use-native-transport</Tag></Text>}>
                            <Switch checked={serverProps['use-native-transport']} onChange={v => handlePropChange('use-native-transport', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* enable-status */}
                      {(!configSearch || 'enable-status'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Hiện trạng thái Server <Tag style={{ fontSize: 10 }}>enable-status</Tag></Text>}>
                            <Switch checked={serverProps['enable-status']} onChange={v => handlePropChange('enable-status', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* status-heartbeat-interval */}
                      {(!configSearch || 'status-heartbeat-interval'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Heartbeat Interval <Tag style={{ fontSize: 10 }}>status-heartbeat-interval</Tag></Text>}>
                            <InputNumber min={0} value={serverProps['status-heartbeat-interval']} onChange={v => handlePropChange('status-heartbeat-interval', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* hide-online-players */}
                      {(!configSearch || 'hide-online-players'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Ẩn người chơi online <Tag style={{ fontSize: 10 }}>hide-online-players</Tag></Text>}>
                            <Switch checked={serverProps['hide-online-players']} onChange={v => handlePropChange('hide-online-players', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* bug-report-link */}
                      {(!configSearch || 'bug-report-link'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24} md={18}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Link Báo lỗi (Bug Report) <Tag style={{ fontSize: 10 }}>bug-report-link</Tag></Text>}>
                            <Input value={serverProps['bug-report-link']} placeholder="https://example.com/bugs" onChange={e => handlePropChange('bug-report-link', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* debug */}
                      {(!configSearch || 'debug'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Chế độ Gỡ lỗi <Tag style={{ fontSize: 10 }}>debug</Tag></Text>}>
                            <Switch checked={serverProps['debug']} onChange={v => handlePropChange('debug', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* level-name */}
                      {(!configSearch || 'level-name'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Tên thư mục Thế giới <Tag style={{ fontSize: 10 }}>level-name</Tag></Text>}>
                            <Input value={serverProps['level-name']} onChange={e => handlePropChange('level-name', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* level-seed */}
                      {(!configSearch || 'level-seed'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Hạt giống (Seed) <Tag style={{ fontSize: 10 }}>level-seed</Tag></Text>}>
                            <Input value={serverProps['level-seed']} placeholder="Để trống nếu ngẫu nhiên" onChange={e => handlePropChange('level-seed', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* level-type */}
                      {(!configSearch || 'level-type'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Loại địa hình <Tag style={{ fontSize: 10 }}>level-type</Tag></Text>}>
                            <Select
                              value={serverProps['level-type']}
                              onChange={v => handlePropChange('level-type', v)}
                              options={[
                                { label: 'Bình thường (minecraft:normal)', value: 'minecraft:normal' },
                                { label: 'Siêu phẳng (minecraft:flat)', value: 'minecraft:flat' },
                                { label: 'Sinh thái lớn (minecraft:large_biomes)', value: 'minecraft:large_biomes' },
                                { label: 'Núi đồi gập ghềnh (minecraft:amplified)', value: 'minecraft:amplified' }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* generate-structures */}
                      {(!configSearch || 'generate-structures'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Tự động tạo Cấu trúc <Tag style={{ fontSize: 10 }}>generate-structures</Tag></Text>}>
                            <Switch checked={serverProps['generate-structures']} onChange={v => handlePropChange('generate-structures', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* spawn-protection */}
                      {(!configSearch || 'spawn-protection'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bán kính bảo vệ Spawn <Tag style={{ fontSize: 10 }}>spawn-protection</Tag></Text>}>
                            <InputNumber min={0} max={1000} value={serverProps['spawn-protection']} onChange={v => handlePropChange('spawn-protection', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* sync-chunk-writes */}
                      {(!configSearch || 'sync-chunk-writes'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Ghi Chunk đồng bộ <Tag style={{ fontSize: 10 }}>sync-chunk-writes</Tag></Text>}>
                            <Switch checked={serverProps['sync-chunk-writes']} onChange={v => handlePropChange('sync-chunk-writes', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* max-world-size */}
                      {(!configSearch || 'max-world-size'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Giới hạn kích thước World <Tag style={{ fontSize: 10 }}>max-world-size</Tag></Text>}>
                            <InputNumber min={1000} max={29999984} value={serverProps['max-world-size']} onChange={v => handlePropChange('max-world-size', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* region-file-compression */}
                      {(!configSearch || 'region-file-compression'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Chuẩn nén tệp Region <Tag style={{ fontSize: 10 }}>region-file-compression</Tag></Text>}>
                            <Select
                              value={serverProps['region-file-compression']}
                              onChange={v => handlePropChange('region-file-compression', v)}
                              options={[
                                { label: 'deflate (Mặc định)', value: 'deflate' },
                                { label: 'gzip', value: 'gzip' },
                                { label: 'none (Không nén)', value: 'none' }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* initial-enabled-packs */}
                      {(!configSearch || 'initial-enabled-packs'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Resource Pack bật sẵn <Tag style={{ fontSize: 10 }}>initial-enabled-packs</Tag></Text>}>
                            <Input value={serverProps['initial-enabled-packs']} onChange={e => handlePropChange('initial-enabled-packs', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* initial-disabled-packs */}
                      {(!configSearch || 'initial-disabled-packs'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Resource Pack tắt sẵn <Tag style={{ fontSize: 10 }}>initial-disabled-packs</Tag></Text>}>
                            <Input value={serverProps['initial-disabled-packs']} onChange={e => handlePropChange('initial-disabled-packs', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* generator-settings */}
                      {(!configSearch || 'generator-settings'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Generator Settings (JSON) <Tag style={{ fontSize: 10 }}>generator-settings</Tag></Text>}>
                            <Input value={serverProps['generator-settings']} onChange={e => handlePropChange('generator-settings', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* gamemode */}
                      {(!configSearch || 'gamemode'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Chế độ chơi (Gamemode) <Tag style={{ fontSize: 10 }}>gamemode</Tag></Text>}>
                            <Select
                              value={serverProps['gamemode']}
                              onChange={v => handlePropChange('gamemode', v)}
                              options={[
                                { label: 'Sinh tồn (survival)', value: 'survival' },
                                { label: 'Sáng tạo (creative)', value: 'creative' },
                                { label: 'Phiêu lưu (adventure)', value: 'adventure' },
                                { label: 'Quan sát (spectator)', value: 'spectator' }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* force-gamemode */}
                      {(!configSearch || 'force-gamemode'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bắt buộc Gamemode <Tag style={{ fontSize: 10 }}>force-gamemode</Tag></Text>}>
                            <Switch checked={serverProps['force-gamemode']} onChange={v => handlePropChange('force-gamemode', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* difficulty */}
                      {(!configSearch || 'difficulty'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Độ khó (Difficulty) <Tag style={{ fontSize: 10 }}>difficulty</Tag></Text>}>
                            <Select
                              value={serverProps['difficulty']}
                              onChange={v => handlePropChange('difficulty', v)}
                              options={[
                                { label: 'Hòa bình (peaceful)', value: 'peaceful' },
                                { label: 'Dễ (easy)', value: 'easy' },
                                { label: 'Bình thường (normal)', value: 'normal' },
                                { label: 'Khó (hard)', value: 'hard' }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* hardcore */}
                      {(!configSearch || 'hardcore'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Siêu khó (Hardcore) <Tag style={{ fontSize: 10 }}>hardcore</Tag></Text>}>
                            <Switch checked={serverProps['hardcore']} onChange={v => handlePropChange('hardcore', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* pvp */}
                      {(!configSearch || 'pvp'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bật PvP (Đánh nhau) <Tag style={{ fontSize: 10 }}>pvp</Tag></Text>}>
                            <Switch checked={serverProps['pvp']} onChange={v => handlePropChange('pvp', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* allow-nether */}
                      {(!configSearch || 'allow-nether'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cho phép sang Nether <Tag style={{ fontSize: 10 }}>allow-nether</Tag></Text>}>
                            <Switch checked={serverProps['allow-nether']} onChange={v => handlePropChange('allow-nether', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* allow-flight */}
                      {(!configSearch || 'allow-flight'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cho phép bay (Allow Flight) <Tag style={{ fontSize: 10 }}>allow-flight</Tag></Text>}>
                            <Switch checked={serverProps['allow-flight']} onChange={v => handlePropChange('allow-flight', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* white-list */}
                      {(!configSearch || 'white-list'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Duyệt danh sách (Whitelist) <Tag style={{ fontSize: 10 }}>white-list</Tag></Text>}>
                            <Switch checked={serverProps['white-list']} onChange={v => handlePropChange('white-list', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* enforce-whitelist */}
                      {(!configSearch || 'enforce-whitelist'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bắt buộc Whitelist reload <Tag style={{ fontSize: 10 }}>enforce-whitelist</Tag></Text>}>
                            <Switch checked={serverProps['enforce-whitelist']} onChange={v => handlePropChange('enforce-whitelist', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* enforce-secure-profile */}
                      {(!configSearch || 'enforce-secure-profile'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Chữ ký Chống giả mạo <Tag style={{ fontSize: 10 }}>enforce-secure-profile</Tag></Text>}>
                            <Switch checked={serverProps['enforce-secure-profile']} onChange={v => handlePropChange('enforce-secure-profile', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* player-idle-timeout */}
                      {(!configSearch || 'player-idle-timeout'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Thời gian treo máy Kick (Phút) <Tag style={{ fontSize: 10 }}>player-idle-timeout</Tag></Text>}>
                            <InputNumber min={0} value={serverProps['player-idle-timeout']} onChange={v => handlePropChange('player-idle-timeout', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* pause-when-empty-seconds */}
                      {(!configSearch || 'pause-when-empty-seconds'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Pause server khi trống (Giây) <Tag style={{ fontSize: 10 }}>pause-when-empty-seconds</Tag></Text>}>
                            <InputNumber min={-1} value={serverProps['pause-when-empty-seconds']} onChange={v => handlePropChange('pause-when-empty-seconds', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* op-permission-level */}
                      {(!configSearch || 'op-permission-level'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cấp quyền OP Administrator <Tag style={{ fontSize: 10 }}>op-permission-level</Tag></Text>}>
                            <Select
                              value={serverProps['op-permission-level']}
                              onChange={v => handlePropChange('op-permission-level', v)}
                              options={[
                                { label: 'Cấp 1 - Bypass spawn protection', value: 1 },
                                { label: 'Cấp 2 - Lệnh clear, difficulty, tp, give', value: 2 },
                                { label: 'Cấp 3 - Lệnh ban, kick, op, deop', value: 3 },
                                { label: 'Cấp 4 - Toàn quyền dừng server /stop', value: 4 }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* function-permission-level */}
                      {(!configSearch || 'function-permission-level'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cấp quyền Function Datapack <Tag style={{ fontSize: 10 }}>function-permission-level</Tag></Text>}>
                            <Select
                              value={serverProps['function-permission-level']}
                              onChange={v => handlePropChange('function-permission-level', v)}
                              options={[
                                { label: 'Cấp 1', value: 1 },
                                { label: 'Cấp 2', value: 2 },
                                { label: 'Cấp 3', value: 3 },
                                { label: 'Cấp 4', value: 4 }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* broadcast-console-to-ops */}
                      {(!configSearch || 'broadcast-console-to-ops'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Gửi Log Console tới OP <Tag style={{ fontSize: 10 }}>broadcast-console-to-ops</Tag></Text>}>
                            <Switch checked={serverProps['broadcast-console-to-ops']} onChange={v => handlePropChange('broadcast-console-to-ops', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* broadcast-rcon-to-ops */}
                      {(!configSearch || 'broadcast-rcon-to-ops'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Gửi Log RCON tới OP <Tag style={{ fontSize: 10 }}>broadcast-rcon-to-ops</Tag></Text>}>
                            <Switch checked={serverProps['broadcast-rcon-to-ops']} onChange={v => handlePropChange('broadcast-rcon-to-ops', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* view-distance */}
                      {(!configSearch || 'view-distance'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Tầm nhìn Render (View Distance) <Tag style={{ fontSize: 10 }}>view-distance</Tag></Text>}>
                            <InputNumber min={3} max={32} value={serverProps['view-distance']} onChange={v => handlePropChange('view-distance', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* simulation-distance */}
                      {(!configSearch || 'simulation-distance'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Khoảng cách Simulation (Chunks) <Tag style={{ fontSize: 10 }}>simulation-distance</Tag></Text>}>
                            <InputNumber min={3} max={32} value={serverProps['simulation-distance']} onChange={v => handlePropChange('simulation-distance', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* max-tick-time */}
                      {(!configSearch || 'max-tick-time'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Watchdog Max Tick Time (ms) <Tag style={{ fontSize: 10 }}>max-tick-time</Tag></Text>}>
                            <InputNumber min={-1} value={serverProps['max-tick-time']} onChange={v => handlePropChange('max-tick-time', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* network-compression-threshold */}
                      {(!configSearch || 'network-compression-threshold'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Ngưỡng nén gói tin Mạng (Bytes) <Tag style={{ fontSize: 10 }}>network-compression-threshold</Tag></Text>}>
                            <InputNumber min={-1} value={serverProps['network-compression-threshold']} onChange={v => handlePropChange('network-compression-threshold', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* max-chained-neighbor-updates */}
                      {(!configSearch || 'max-chained-neighbor-updates'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Max Chained Block Updates <Tag style={{ fontSize: 10 }}>max-chained-neighbor-updates</Tag></Text>}>
                            <InputNumber min={1000} value={serverProps['max-chained-neighbor-updates']} onChange={v => handlePropChange('max-chained-neighbor-updates', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* entity-broadcast-range-percentage */}
                      {(!configSearch || 'entity-broadcast-range-percentage'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Tỷ lệ phát sóng vị trí Thực thể (%) <Tag style={{ fontSize: 10 }}>entity-broadcast-range-percentage</Tag></Text>}>
                            <InputNumber min={10} max={500} value={serverProps['entity-broadcast-range-percentage']} onChange={v => handlePropChange('entity-broadcast-range-percentage', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* rate-limit */}
                      {(!configSearch || 'rate-limit'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Rate Limit gói tin <Tag style={{ fontSize: 10 }}>rate-limit</Tag></Text>}>
                            <InputNumber min={0} value={serverProps['rate-limit']} onChange={v => handlePropChange('rate-limit', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* enable-rcon */}
                      {(!configSearch || 'enable-rcon'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bật cổng RCON <Tag style={{ fontSize: 10 }}>enable-rcon</Tag></Text>}>
                            <Switch checked={serverProps['enable-rcon']} onChange={v => handlePropChange('enable-rcon', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* rcon.port */}
                      {(!configSearch || 'rcon.port'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cổng kết nối RCON <Tag style={{ fontSize: 10 }}>rcon.port</Tag></Text>}>
                            <InputNumber min={1} max={65535} value={serverProps['rcon.port']} onChange={v => handlePropChange('rcon.port', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* rcon.password */}
                      {(!configSearch || 'rcon.password'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={12}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Mật khẩu RCON Server <Tag style={{ fontSize: 10 }}>rcon.password</Tag></Text>}>
                            <Input.Password value={serverProps['rcon.password']} placeholder="Nhập mật khẩu RCON" onChange={e => handlePropChange('rcon.password', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* enable-query */}
                      {(!configSearch || 'enable-query'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bật cổng Query (GameSpy4) <Tag style={{ fontSize: 10 }}>enable-query</Tag></Text>}>
                            <Switch checked={serverProps['enable-query']} onChange={v => handlePropChange('enable-query', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* query.port */}
                      {(!configSearch || 'query.port'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cổng Query Port <Tag style={{ fontSize: 10 }}>query.port</Tag></Text>}>
                            <InputNumber min={1} max={65535} value={serverProps['query.port']} onChange={v => handlePropChange('query.port', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* enable-jmx-monitoring */}
                      {(!configSearch || 'enable-jmx-monitoring'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={12}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bật Java JMX Monitoring <Tag style={{ fontSize: 10 }}>enable-jmx-monitoring</Tag></Text>}>
                            <Switch checked={serverProps['enable-jmx-monitoring']} onChange={v => handlePropChange('enable-jmx-monitoring', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* resource-pack */}
                      {(!configSearch || 'resource-pack'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24} md={18}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Đường dẫn Resource Pack (URL) <Tag style={{ fontSize: 10 }}>resource-pack</Tag></Text>}>
                            <Input value={serverProps['resource-pack']} placeholder="https://example.com/pack.zip" onChange={e => handlePropChange('resource-pack', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* require-resource-pack */}
                      {(!configSearch || 'require-resource-pack'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bắt buộc tải Resource Pack <Tag style={{ fontSize: 10 }}>require-resource-pack</Tag></Text>}>
                            <Switch checked={serverProps['require-resource-pack']} onChange={v => handlePropChange('require-resource-pack', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* resource-pack-id */}
                      {(!configSearch || 'resource-pack-id'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Resource Pack UUID <Tag style={{ fontSize: 10 }}>resource-pack-id</Tag></Text>}>
                            <Input value={serverProps['resource-pack-id']} onChange={e => handlePropChange('resource-pack-id', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* resource-pack-sha1 */}
                      {(!configSearch || 'resource-pack-sha1'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Mã SHA-1 Hash <Tag style={{ fontSize: 10 }}>resource-pack-sha1</Tag></Text>}>
                            <Input value={serverProps['resource-pack-sha1']} onChange={e => handlePropChange('resource-pack-sha1', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* accepts-transfers */}
                      {(!configSearch || 'accepts-transfers'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cho phép Server Transfer <Tag style={{ fontSize: 10 }}>accepts-transfers</Tag></Text>}>
                            <Switch checked={serverProps['accepts-transfers']} onChange={v => handlePropChange('accepts-transfers', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* resource-pack-prompt */}
                      {(!configSearch || 'resource-pack-prompt'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Lời nhắn tải Resource Pack (Prompt) <Tag style={{ fontSize: 10 }}>resource-pack-prompt</Tag></Text>}>
                            <Input value={serverProps['resource-pack-prompt']} onChange={e => handlePropChange('resource-pack-prompt', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* text-filtering-config */}
                      {(!configSearch || 'text-filtering-config'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={16}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Tệp Cấu hình Lọc tin nhắn <Tag style={{ fontSize: 10 }}>text-filtering-config</Tag></Text>}>
                            <Input value={serverProps['text-filtering-config']} onChange={e => handlePropChange('text-filtering-config', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* text-filtering-version */}
                      {(!configSearch || 'text-filtering-version'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={8}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Phiên bản Lọc tin nhắn <Tag style={{ fontSize: 10 }}>text-filtering-version</Tag></Text>}>
                            <InputNumber min={0} value={serverProps['text-filtering-version']} onChange={v => handlePropChange('text-filtering-version', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* management-server-enabled */}
                      {(!configSearch || 'management-server-enabled'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Bật Management API <Tag style={{ fontSize: 10 }}>management-server-enabled</Tag></Text>}>
                            <Switch checked={serverProps['management-server-enabled']} onChange={v => handlePropChange('management-server-enabled', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* management-server-host */}
                      {(!configSearch || 'management-server-host'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Host API <Tag style={{ fontSize: 10 }}>management-server-host</Tag></Text>}>
                            <Input value={serverProps['management-server-host']} onChange={e => handlePropChange('management-server-host', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* management-server-port */}
                      {(!configSearch || 'management-server-port'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Cổng API Port <Tag style={{ fontSize: 10 }}>management-server-port</Tag></Text>}>
                            <InputNumber min={0} max={65535} value={serverProps['management-server-port']} onChange={v => handlePropChange('management-server-port', v)} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* management-server-tls-enabled */}
                      {(!configSearch || 'management-server-tls-enabled'.includes(configSearch.toLowerCase())) && (
                        <Col xs={12} md={6}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Mã hóa TLS API <Tag style={{ fontSize: 10 }}>management-server-tls-enabled</Tag></Text>}>
                            <Switch checked={serverProps['management-server-tls-enabled']} onChange={v => handlePropChange('management-server-tls-enabled', v)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* management-server-secret */}
                      {(!configSearch || 'management-server-secret'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24} md={12}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Secret Key <Tag style={{ fontSize: 10 }}>management-server-secret</Tag></Text>}>
                            <Input.Password value={serverProps['management-server-secret']} onChange={e => handlePropChange('management-server-secret', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}

                      {/* management-server-allowed-origins */}
                      {(!configSearch || 'management-server-allowed-origins'.includes(configSearch.toLowerCase())) && (
                        <Col xs={24} md={12}>
                          <Form.Item label={<Text style={{ fontSize: 13 }}>Allowed Origins (CORS) <Tag style={{ fontSize: 10 }}>management-server-allowed-origins</Tag></Text>}>
                            <Input value={serverProps['management-server-allowed-origins']} placeholder="*" onChange={e => handlePropChange('management-server-allowed-origins', e.target.value)} />
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  </Form>
                </div>
              )
            },
            {
              key: 'players',
              label: 'Quản lý Người chơi',
              children: (
                <div style={{ paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Input
                      prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                      placeholder="Tìm kiếm người chơi..."
                      value={playerSearch}
                      onChange={e => setPlayerSearch(e.target.value)}
                      style={{ width: 320, borderRadius: 6 }}
                      allowClear
                    />
                    <Space>
                      <Button icon={<PlusOutlined />} onClick={() => message.info('Mở modal thêm Whitelist')}>Thêm Whitelist</Button>
                      <Button danger icon={<PlusOutlined />} onClick={() => message.info('Mở modal Ban người chơi')}>Ban Người chơi</Button>
                    </Space>
                  </div>

                  <KTable
                    viewKeyPrefix="mc-players"
                    locale={{
                      triggerDesc: 'Nhấp để sắp xếp giảm dần',
                      triggerAsc: 'Nhấp để sắp xếp tăng dần',
                      cancelSort: 'Nhấp để hủy sắp xếp'
                    }}
                    rowKey="uuid"
                    dataSource={filteredPlayers}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: () => {
                        const isAllSelected = filteredPlayers.length > 0 && selectedPlayerRowKeys.length === filteredPlayers.length;
                        const isIndeterminate = selectedPlayerRowKeys.length > 0 && selectedPlayerRowKeys.length < filteredPlayers.length;
                        return (
                          <Space>
                            <Checkbox
                              style={{ marginLeft: 0, marginRight: 10 }}
                              indeterminate={isIndeterminate}
                              checked={isAllSelected}
                              onChange={(e) => setSelectedPlayerRowKeys(e.target.checked ? filteredPlayers.map(d => d.uuid) : [])}
                            />
                            <Select
                              size="small"
                              value={playerBatchAction || undefined}
                              onChange={setPlayerBatchAction}
                              style={{ width: 140 }}
                              placeholder="Chọn thao tác..."
                              options={[
                                { value: 'kick', label: <Space><StopOutlined /> Kick</Space> },
                                { value: 'ban', label: <Space><DeleteOutlined /> Ban</Space> },
                                { value: 'op', label: <Space><UserOutlined /> Cấp/Tước OP</Space> }
                              ]}
                            />
                            <Button size="small" onClick={handleExecutePlayerBatch}>Thực thi</Button>
                          </Space>
                        );
                      }
                    }}
                    size="middle"
                    rowSelection={{ selectedRowKeys: selectedPlayerRowKeys, onChange: setSelectedPlayerRowKeys }}
                    columns={[
                      {
                        title: 'Người chơi',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text, record) => (
                          <Space align="center">
                            <img
                              src={`https://mc-heads.net/avatar/${text}/24`}
                              alt={text}
                              style={{ width: 24, height: 24, borderRadius: 4 }}
                              onError={(e) => { (e.target as any).src = 'https://mc-heads.net/avatar/MHF_Steve/24'; }}
                            />
                            <Text strong>{text}</Text>
                            {record.isOp && <Tag color="gold">OP</Tag>}
                          </Space>
                        ),
                        sorter: (a, b) => a.name.localeCompare(b.name)
                      },
                      { title: 'UUID', dataIndex: 'uuid', key: 'uuid', render: (u) => <Text type="secondary" style={{ fontSize: 11 }}>{u}</Text> },
                      { title: 'Độ trễ (Ping)', dataIndex: 'ping', key: 'ping', render: (p) => <Tag color={p < 40 ? 'green' : 'orange'}>{p} ms</Tag>, sorter: (a, b) => a.ping - b.ping },
                      { title: 'Thời gian online', dataIndex: 'playtime', key: 'playtime' },
                      { title: 'Thế giới', dataIndex: 'dimension', key: 'dimension', render: (d) => <Tag color="cyan">{d}</Tag> },
                      {
                        title: 'Thao tác',
                        key: 'action',
                        render: (_, record) => (
                          <Space>
                            <Button size="small" type="primary" style={{ backgroundColor: '#009688', borderColor: '#009688' }} onClick={() => handleOpenPlayerDetail(record)}>
                              Chi tiết
                            </Button>
                            <Button size="small" onClick={() => handleToggleOp(record.name)}>
                              {record.isOp ? 'Tước OP' : 'Cấp OP'}
                            </Button>
                            <Popconfirm title={`Kick ${record.name} khỏi máy chủ?`} onConfirm={() => handleKickPlayer(record.name)}>
                              <Button size="small" danger>Kick</Button>
                            </Popconfirm>
                          </Space>
                        )
                      }
                    ]}
                  />
                </div>
              )
            },
            {
              key: 'plugins',
              label: 'Cửa hàng Plugin',
              children: (
                <div style={{ paddingTop: 12 }}>
                  {/* Top Bar Navigation Sub-tabs */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <Space size="small">
                      <Button
                        type={storeSubTab === 'store' ? 'primary' : 'default'}
                        onClick={() => setStoreSubTab('store')}
                        style={storeSubTab === 'store' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
                      >
                        Cửa hàng Marketplace ({marketplacePlugins.length})
                      </Button>
                      <Button
                        type={storeSubTab === 'installed' ? 'primary' : 'default'}
                        onClick={() => setStoreSubTab('installed')}
                        style={storeSubTab === 'installed' ? { backgroundColor: '#009688', borderColor: '#009688' } : {}}
                      >
                        Plugin & Mod đã cài đặt ({plugins.length})
                      </Button>
                    </Space>

                    <Button type="primary" icon={<CloudUploadOutlined />} style={{ backgroundColor: '#009688', borderColor: '#009688' }}>
                      Tải lên Plugin (.jar)
                    </Button>
                  </div>

                  {storeSubTab === 'store' ? (
                    <div>
                      {/* Search & Filter Header */}
                      <div style={{ marginBottom: 16 }}>
                        <Row gutter={[12, 12]} align="middle">
                          <Col xs={24} md={10}>
                            <Input
                              prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                              placeholder="Tìm kiếm plugin/mod (EssentialsX, WorldEdit, LuckPerms...)..."
                              value={storeSearch}
                              onChange={e => setStoreSearch(e.target.value)}
                              allowClear
                            />
                          </Col>

                          <Col xs={12} md={7}>
                            <Select
                              style={{ width: '100%' }}
                              value={storeCategory}
                              onChange={v => setStoreCategory(v)}
                              options={[
                                { label: 'Tất cả danh mục', value: 'all' },
                                { label: 'Admin & Bảo mật', value: 'admin' },
                                { label: 'Thế giới & Xây dựng', value: 'world' },
                                { label: 'Tối ưu & Hiệu năng', value: 'performance' },
                                { label: 'Lối chơi & Tính năng', value: 'gameplay' }
                              ]}
                            />
                          </Col>

                          <Col xs={12} md={7}>
                            <Select
                              style={{ width: '100%' }}
                              value={storePlatform}
                              onChange={v => setStorePlatform(v)}
                              options={[
                                { label: 'Tất cả nguồn (All Platforms)', value: 'all' },
                                { label: 'SpigotMC Official', value: 'SpigotMC' },
                                { label: 'Modrinth Official', value: 'Modrinth' },
                                { label: 'CurseForge', value: 'CurseForge' }
                              ]}
                            />
                          </Col>
                        </Row>
                      </div>

                      {/* Plugins Marketplace Grid */}
                      <Row gutter={[16, 16]}>
                        {marketplacePlugins
                          .filter(item => {
                            const matchSearch = item.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
                              item.desc.toLowerCase().includes(storeSearch.toLowerCase()) ||
                              item.author.toLowerCase().includes(storeSearch.toLowerCase());
                            const matchCategory = storeCategory === 'all' || item.category === storeCategory;
                            const matchPlatform = storePlatform === 'all' || item.platform === storePlatform;
                            return matchSearch && matchCategory && matchPlatform;
                          })
                          .map(item => (
                            <Col xs={24} sm={12} lg={8} key={item.id}>
                              <Card
                                hoverable
                                size="small"
                                style={{
                                  borderRadius: 8,
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  borderColor: item.installed ? '#b7eb8f' : '#e8e8e8'
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <Space align="center">
                                      {item.icon}
                                      <div>
                                        <Text strong style={{ fontSize: 15 }}>{item.name}</Text>
                                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                                          <Tag color={item.platform === 'SpigotMC' ? 'orange' : item.platform === 'Modrinth' ? 'green' : 'purple'} style={{ fontSize: 10, margin: 0 }}>
                                            {item.platform}
                                          </Tag>
                                          <Tag style={{ fontSize: 10, margin: 0 }}>v{item.version}</Tag>
                                        </div>
                                      </div>
                                    </Space>
                                    <Text type="secondary" style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11 }}><StarFilled style={{ color: '#fadb14', marginRight: 4 }} />{item.rating}</Text>
                                  </div>

                                  <Paragraph type="secondary" style={{ fontSize: 12, minHeight: 36, marginBottom: 12, lineHeight: '1.5' }}>
                                    {item.desc}
                                  </Paragraph>
                                </div>

                                <div style={{ paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                                  <Row justify="space-between" align="middle" style={{ marginBottom: 8, width: '100%' }}>
                                    <Col><Text type="secondary" style={{ fontSize: 11 }}>Tác giả: <Text strong>{item.author}</Text></Text></Col>
                                    <Col style={{ textAlign: 'right' }}><Text type="secondary" style={{ fontSize: 11 }}><DownloadOutlined style={{ marginRight: 4 }} />{item.downloads}</Text></Col>
                                  </Row>

                                  {item.installed ? (
                                    <Button disabled block icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} style={{ borderRadius: 6 }}>
                                      Đã cài đặt
                                    </Button>
                                  ) : (
                                    <Button
                                      type="primary"
                                      block
                                      icon={<CloudDownloadOutlined />}
                                      onClick={() => handleInstallPlugin(item)}
                                      style={{ backgroundColor: '#009688', borderColor: '#009688', borderRadius: 6 }}
                                    >
                                      Cài đặt
                                    </Button>
                                  )}
                                </div>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  ) : (
                    <div>
                      {/* Search & Action Toolbar for Installed Plugins */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Input
                          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                          placeholder="Tìm kiếm plugin..."
                          value={pluginSearch}
                          onChange={e => setPluginSearch(e.target.value)}
                          style={{ width: 320, borderRadius: 6 }}
                          allowClear
                        />
                        <Space>
                          {/* Batch Actions */}
                          <Select
                            size="small"
                            value={pluginBatchAction || undefined}
                            onChange={setPluginBatchAction}
                            style={{ width: 140 }}
                            placeholder="Chọn thao tác..."
                            options={[
                              { value: 'enable', label: <Space><CheckCircleOutlined /> Bật</Space> },
                              { value: 'disable', label: <Space><StopOutlined /> Tắt</Space> },
                              { value: 'uninstall', label: <Space><DeleteOutlined style={{ color: 'red' }} /> Gỡ cài đặt</Space> }
                            ]}
                          />
                          <Button size="small" onClick={handleExecutePluginBatch}>Thực thi</Button>
                        </Space>
                      </div>

                      {/* Installed Plugins KTable */}
                      <KTable
                        viewKeyPrefix="installed-plugins"
                        dataSource={plugins.filter(p => !pluginSearch || p.name.toLowerCase().includes(pluginSearch.toLowerCase()) || p.author.toLowerCase().includes(pluginSearch.toLowerCase()))}
                        pagination={false}
                        size="middle"
                        rowSelection={{ selectedRowKeys: selectedPluginRowKeys, onChange: setSelectedPluginRowKeys }}
                        columns={[
                          { title: 'Tên Plugin', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name), render: (t) => <Text strong>{t}</Text> },
                          { title: 'Phiên bản', dataIndex: 'version', key: 'version' },
                          { title: 'Tác giả', dataIndex: 'author', key: 'author' },
                          { title: 'Kích thước', dataIndex: 'size', key: 'size', sorter: (a, b) => parseFloat(a.size) - parseFloat(b.size) || 0 },
                          {
                            title: 'Trạng thái',
                            dataIndex: 'status',
                            key: 'status',
                            render: (st, record) => (
                              <Switch
                                checked={st}
                                onChange={(chk) => {
                                  setPlugins(prev => prev.map(p => p.key === record.key ? { ...p, status: chk } : p));
                                  message.success(`Đã ${chk ? 'bật' : 'tắt'} plugin ${record.name}`);
                                }}
                              />
                            )
                          },
                          {
                            title: 'Hành động',
                            key: 'action',
                            render: (_, record) => (
                              <Space>
                                <Tooltip title="Chỉnh sửa cấu hình">
                                  <Button size="small" icon={<SettingOutlined />} onClick={() => message.info(`Mở cấu hình tệp ${record.name}`)} />
                                </Tooltip>
                                <Popconfirm title={`Gỡ cài đặt plugin ${record.name}?`} onConfirm={() => {
                                  setPlugins(prev => prev.filter(p => p.key !== record.key));
                                  setMarketplacePlugins(prev => prev.map(p => p.name === record.name ? { ...p, installed: false } : p));
                                  message.success(`Đã gỡ cài đặt plugin ${record.name}`);
                                }}>
                                  <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                              </Space>
                            )
                          }
                        ]}
                      />
                    </div>
                  )}
                </div>
              )
            },
            {
              key: 'backups',
              label: 'Sao lưu',
              children: (
                <div style={{ paddingTop: 12 }}>
                  <Alert message="Sao lưu dữ liệu định kỳ giúp bảo vệ thế giới của bạn khỏi các sự cố hư hỏng hoặc mất dữ liệu." type="info" showIcon style={{ marginBottom: 16 }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Input
                      prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                      placeholder="Tìm kiếm bản sao lưu..."
                      value={backupSearch}
                      onChange={e => setBackupSearch(e.target.value)}
                      style={{ width: 320, borderRadius: 6 }}
                      allowClear
                    />
                    <Space>
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateBackup} style={{ backgroundColor: '#009688' }}>
                        Tạo bản sao lưu mới
                      </Button>
                      <Button danger icon={<DeleteOutlined />} onClick={() => message.info('Mở modal dọn rác sao lưu')}>Dọn rác</Button>
                    </Space>
                  </div>

                  <KTable
                    viewKeyPrefix="mc-backups"
                    locale={{
                      triggerDesc: 'Nhấp để sắp xếp giảm dần',
                      triggerAsc: 'Nhấp để sắp xếp tăng dần',
                      cancelSort: 'Nhấp để hủy sắp xếp'
                    }}
                    rowKey="key"
                    dataSource={filteredBackups}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: () => {
                        const isAllSelected = filteredBackups.length > 0 && selectedBackupRowKeys.length === filteredBackups.length;
                        const isIndeterminate = selectedBackupRowKeys.length > 0 && selectedBackupRowKeys.length < filteredBackups.length;
                        return (
                          <Space>
                            <Checkbox
                              style={{ marginLeft: 0, marginRight: 10 }}
                              indeterminate={isIndeterminate}
                              checked={isAllSelected}
                              onChange={(e) => setSelectedBackupRowKeys(e.target.checked ? filteredBackups.map(d => d.key) : [])}
                            />
                            <Select
                              size="small"
                              value={backupBatchAction || undefined}
                              onChange={setBackupBatchAction}
                              style={{ width: 140 }}
                              placeholder="Chọn thao tác..."
                              options={[
                                { value: 'delete', label: <Space><DeleteOutlined /> Xóa</Space> }
                              ]}
                            />
                            <Button size="small" onClick={handleExecuteBackupBatch}>Thực thi</Button>
                          </Space>
                        );
                      }
                    }}
                    size="middle"
                    rowSelection={{ selectedRowKeys: selectedBackupRowKeys, onChange: setSelectedBackupRowKeys }}
                    columns={[
                      { 
                        title: 'Tên file sao lưu', 
                        dataIndex: 'filename', 
                        key: 'filename', 
                        render: (t) => <Text code>{t}</Text>,
                        sorter: (a, b) => a.filename.localeCompare(b.filename)
                      },
                      { 
                        title: 'Ngày tạo', 
                        dataIndex: 'date', 
                        key: 'date',
                        sorter: (a, b) => a.date.localeCompare(b.date)
                      },
                      { 
                        title: 'Dung lượng', 
                        dataIndex: 'size', 
                        key: 'size',
                        sorter: (a, b) => parseFloat(a.size) - parseFloat(b.size)
                      },
                      { 
                        title: 'Loại sao lưu', 
                        dataIndex: 'type', 
                        key: 'type', 
                        render: (t) => <Tag color={t === 'Tự động' ? 'blue' : 'purple'}>{t}</Tag>,
                        sorter: (a, b) => a.type.localeCompare(b.type)
                      },
                      {
                        title: 'Hành động',
                        key: 'action',
                        render: (_, record) => (
                          <Space>
                            <Popconfirm title="Khôi phục máy chủ về điểm sao lưu này?" onConfirm={() => message.success(`Đã khôi phục dữ liệu từ bản sao lưu ${record.filename}`)}>
                              <Button size="small" icon={<UndoOutlined />}>Khôi phục</Button>
                            </Popconfirm>
                            <Button size="small" icon={<DownloadOutlined />} onClick={() => message.info(`Đang tải xuống ${record.filename}...`)} />
                            <Popconfirm title="Xóa bản sao lưu này?" onConfirm={() => setBackups(prev => prev.filter(b => b.key !== record.key))}>
                              <Button size="small" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          </Space>
                        )
                      }
                    ]}
                  />
                </div>
              )
            },
            {
              key: 'files',
              label: 'Thư mục',
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <FilesPage />
                </div>
              )
            }
          ]}
        />

      {/* File Editor Modal */}
      <Modal
        title={`Chỉnh sửa tệp: ${editingFile?.name || ''}`}
        open={!!editingFile}
        onCancel={() => setEditingFile(null)}
        width={750}
        onOk={() => {
          message.success(`Đã lưu tệp ${editingFile?.name} thành công!`);
          setEditingFile(null);
        }}
        okText="Lưu tệp"
        cancelText="Hủy bỏ"
      >
        <Input.TextArea
          rows={14}
          value={fileContent}
          onChange={e => setFileContent(e.target.value)}
          style={{ fontFamily: 'Consolas, Monaco, monospace', background: '#1e1e1e', color: '#f8f8f2', fontSize: 13 }}
        />
      </Modal>

      {/* Software Installation Progress Modal */}
      <Modal
        title={`Cài đặt phần mềm máy chủ: ${targetSoftware?.name || ''}`}
        open={installModalVisible}
        onCancel={() => !installing && setInstallModalVisible(false)}
        footer={null}
        width={550}
      >
        <div style={{ padding: '8px 0' }}>
          {(() => {
            const activeCoreItem = softwareCoresList.find(s => 
              activeCore.name.toLowerCase().includes(s.id) || 
              s.id.toLowerCase().includes(activeCore.name.toLowerCase()) ||
              activeCore.name.toLowerCase() === s.name.toLowerCase()
            );
            const activeCoreCategory = activeCoreItem ? activeCoreItem.category : 'java';
            const isOpposite = targetSoftware && activeCoreCategory !== targetSoftware.category;

            if (!isOpposite) return null;

            return (
              <Alert
                message="Cảnh báo mất dữ liệu"
                description={`Bạn chuẩn bị chuyển đổi từ ${activeCoreCategory === 'java' ? 'Java Edition' : 'Bedrock Edition'} sang ${targetSoftware?.category === 'java' ? 'Java Edition' : 'Bedrock Edition'}. Việc chuyển đổi chéo này sẽ XÓA SẠCH toàn bộ dữ liệu máy chủ cũ (bao gồm thế giới world, các plugin, tệp tin cấu hình). Hãy chắc chắn bạn đã sao lưu dữ liệu trước khi thực hiện!`}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            );
          })()}

          <Alert
            message={`Phiên bản sẽ cài đặt: ${targetSoftware ? (selectedVersions[targetSoftware.id] || targetSoftware.versions[0].value) : ''}`}
            description="Hệ thống sẽ tự động tạo điểm sao lưu dữ liệu cũ, tải xuống core chính thức và cập nhật lại tham số JVM."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />

          {installing ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Progress percent={installStep === 1 ? 35 : installStep === 2 ? 75 : 100} strokeColor="#009688" />
              <div style={{ marginTop: 16 }}>
                <Text strong style={{ fontSize: 14 }}>
                  {installStep === 1 && '1. Đang tạo điểm sao lưu tự động (Backup)...'}
                  {installStep === 2 && `2. Đang tải về phiên bản ${targetSoftware?.name}...`}
                  {installStep === 3 && '3. Đang cập nhật JVM arguments & khởi chạy core...'}
                </Text>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setInstallModalVisible(false)}>Hủy bỏ</Button>
                <Popconfirm
                  title="Xác nhận cài đặt phần mềm"
                  description="Quá trình này sẽ tạm dừng máy chủ để cập nhật. Bạn có chắc chắn muốn tiếp tục?"
                  onConfirm={startInstallation}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  okButtonProps={{ style: { backgroundColor: '#009688', borderColor: '#009688', color: '#fff' } }}
                >
                  <Button type="primary" icon={<DownloadOutlined />} style={{ backgroundColor: '#009688', borderColor: '#009688' }}>
                    Xác nhận cài đặt ngay
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          )}
        </div>
      </Modal>

      {/* Plugin Installation Progress Modal */}
      <Modal
        title={`Cài đặt Plugin: ${installingPlugin?.name || ''}`}
        open={installingPluginModal}
        footer={null}
        closable={false}
        width={500}
      >
        <div style={{ padding: '12px 0', textAlign: 'center' }}>
          <Progress percent={pluginInstallProgress} strokeColor="#009688" />
          <div style={{ marginTop: 20 }}>
            <Text strong style={{ fontSize: 14 }}>
              {pluginInstallStep === 1 && `1. Đang tải về tệp ${installingPlugin?.name}.jar từ ${installingPlugin?.platform}...`}
              {pluginInstallStep === 2 && '2. Đang kiểm tra phụ thuộc (Dependencies API)...'}
              {pluginInstallStep === 3 && '3. Đang đưa tệp vào thư mục /home/container/plugins/...'}
              {pluginInstallStep === 4 && '4. Kích hoạt plugin hoàn tất!'}
            </Text>
          </div>
        </div>
      </Modal>
      {/* Raw server.properties Modal */}
      <Modal
        title="Tệp cấu hình thô: server.properties"
        open={rawConfigModal}
        onCancel={() => setRawConfigModal(false)}
        footer={[
          <Button key="close" onClick={() => setRawConfigModal(false)}>Đóng</Button>,
          <Button
            key="copy"
            type="primary"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(generateRawProperties());
              message.success('Đã sao chép toàn bộ nội dung server.properties!');
            }}
            style={{ backgroundColor: '#009688', borderColor: '#009688' }}
          >
            Sao chép nội dung
          </Button>
        ]}
        width={650}
      >
        <Input.TextArea
          rows={16}
          value={generateRawProperties()}
          readOnly
          style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: 13, background: '#1e1e1e', color: '#4ec9b0', borderRadius: 6, height: 380, minHeight: 380 }}
        />
      </Modal>
    </div>
  );
};

export default MinecraftPanel;
