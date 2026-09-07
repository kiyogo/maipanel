import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Avatar,
  List,
  Space,
  Typography,
  Tooltip,
  Dropdown,
  Tabs,
  Button,
  Badge,
  Modal,
  Form,
  Select,
  Collapse,
  Table,
  Popconfirm,
  Divider,
  Tag,
  message,
  Spin,
  Row,
  Col,
  Switch
} from '../custom-ui';
import {
  RobotOutlined,
  UserOutlined,
  PlusOutlined,
  MessageOutlined,
  CodeOutlined,
  CopyOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  SearchOutlined,
  SettingOutlined,
  DownOutlined,
  CheckOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
  DatabaseOutlined,
  ProjectOutlined,
  FileTextOutlined,
  LockOutlined,
  UnlockOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  AppstoreAddOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { aiApi, projectsApi, databasesApi } from '../api/endpoints';
import { useLanguage } from '../context/LanguageContext';

const { Text, Title, Paragraph } = Typography;

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinkingProcess?: string;
  plan?: Array<{
    id: string;
    step: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
    description?: string;
  }>;
  toolUsages?: Array<{
    id: string;
    tool: string;
    command?: string;
    arguments?: string;
    output?: string;
    status: 'pending' | 'running' | 'success' | 'failed';
  }>;
  subAgentLogs?: Array<{
    timestamp: string;
    agent: string;
    message: string;
    level: 'info' | 'warning' | 'error';
  }>;
  approvals?: Array<{
    id: string;
    type: 'file' | 'folder' | 'project' | 'database' | 'server' | 'deploy' | 'terminal';
    action: string;
    target: string;
    details?: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  executionPreview?: string;
  filesTouched?: Array<{
    filepath: string;
    status: 'modified' | 'created' | 'deleted';
    diff?: string;
  }>;
  createdAt: string;
}

interface Memory {
  id: string;
  category: string;
  title: string;
  details: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  progress: number;
  agent: string;
  priority: string;
}

const AICenter: React.FC = () => {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  
  // Model & Thinking
  const [selectedModel, setSelectedModel] = useState('Gemini 3.5 Flash (High)');
  const [thinkingEnabled, setThinkingEnabled] = useState(true);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  // Tabs / Side details
  const [rightPanelTab, setRightPanelTab] = useState('context');
  const [selectedFileDiff, setSelectedFileDiff] = useState<{ filepath: string; diff?: string } | null>(null);

  // Real-time Context Data
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [databasesList, setDatabasesList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [convoSearch, setConvoSearch] = useState('');

  // Memory Modals
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [memoryForm] = Form.useForm();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const res = await aiApi.getConversations();
      setConversations(res.data);
      if (res.data.length > 0 && !activeConvoId) {
        setActiveConvoId(res.data[0].id);
      }
    } catch {
      message.error(t('ai.msgErrorLoadHistory'));
    }
  };

  const loadMessages = async (convoId: string) => {
    try {
      setLoading(true);
      const res = await aiApi.getMessages(convoId);
      setMessages(res.data);
      // Auto select first file diff if available
      const lastAssistantMsg = [...res.data].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMsg && lastAssistantMsg.filesTouched && lastAssistantMsg.filesTouched.length > 0) {
        setSelectedFileDiff(lastAssistantMsg.filesTouched[0]);
      } else {
        setSelectedFileDiff(null);
      }
    } catch {
      message.error(t('ai.msgErrorLoadDetails'));
    } finally {
      setLoading(false);
    }
  };

  const loadContextData = async () => {
    try {
      const [projRes, dbRes, taskRes, memoryRes] = await Promise.all([
        projectsApi.getAll(),
        databasesApi.getAll(),
        aiApi.getTasks(),
        aiApi.getMemories()
      ]);
      setProjectsList(projRes.data);
      setDatabasesList(dbRes.data);
      setTasksList(taskRes.data);
      setMemories(memoryRes.data);
    } catch (err) {
      console.error('Error fetching context data:', err);
    }
  };

  useEffect(() => {
    loadConversations();
    loadContextData();
  }, []);

  useEffect(() => {
    if (activeConvoId) {
      loadMessages(activeConvoId);
    } else {
      setMessages([]);
    }
  }, [activeConvoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    let interval: any;
    if (sending) {
      setThinkingStep(0);
      interval = setInterval(() => {
        setThinkingStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    } else {
      setThinkingStep(0);
    }
    return () => clearInterval(interval);
  }, [sending]);

  const handleCreateConvo = async () => {
    try {
      const res = await aiApi.createConversation(`${t('ai.titleConvoPrefix')} ${new Date().toLocaleDateString()}`);
      setConversations([res.data, ...conversations]);
      setActiveConvoId(res.data.id);
      message.success(t('ai.msgSuccessCreateConvo'));
    } catch {
      message.error(t('ai.msgErrorCreateConvo'));
    }
  };

  const handleDeleteConvo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await aiApi.deleteConversation(id);
      setConversations(conversations.filter(c => c.id !== id));
      if (activeConvoId === id) {
        setActiveConvoId(conversations[0]?.id !== id ? conversations[0]?.id : conversations[1]?.id || null);
      }
      message.success(t('ai.msgSuccessDeleteConvo'));
    } catch {
      message.error(t('ai.msgErrorDeleteConvo'));
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConvoId) return;
    const content = inputText;
    setInputText('');
    setSending(true);

    // Mock initial message inside state to display typing flow
    const tempUserMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await aiApi.sendMessage(activeConvoId, content, thinkingEnabled);
      // Replace or update state
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, res.data]);
      
      // Select file diff if any
      if (res.data.filesTouched && res.data.filesTouched.length > 0) {
        setSelectedFileDiff(res.data.filesTouched[0]);
        setRightPanelTab('files');
      }
      
      loadContextData(); // Sync tables immediately
    } catch {
      message.error(t('ai.msgErrorSend'));
    } finally {
      setSending(false);
    }
  };

  const handleApprove = async (messageId: string, approvalId: string, status: 'approved' | 'rejected') => {
    message.loading({ content: t('ai.msgProcessingApproval'), key: 'ai_approval' });
    try {
      const res = await aiApi.approveAction(messageId, approvalId, status);
      // Update message in state
      setMessages(prev => prev.map(m => (m.id === messageId ? res.data : m)));
      
      if (status === 'approved') {
        message.success({ content: t('ai.msgSuccessApprove'), key: 'ai_approval', duration: 3 });
      } else {
        message.warning({ content: t('ai.msgDeniedAction'), key: 'ai_approval', duration: 3 });
      }
      
      loadContextData(); // Reload projects/databases
    } catch {
      message.error({ content: t('ai.msgErrorApproval'), key: 'ai_approval' });
    }
  };

  const handleCreateMemory = async (values: any) => {
    try {
      await aiApi.createMemory(values);
      setMemoryModalOpen(false);
      memoryForm.resetFields();
      message.success(t('ai.msgSuccessCreateMemory'));
      loadContextData();
    } catch {
      message.error(t('ai.msgErrorCreateMemory'));
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await aiApi.deleteMemory(id);
      message.success(t('ai.msgSuccessDeleteMemory'));
      loadContextData();
    } catch {
      message.error(t('ai.msgErrorDeleteMemory'));
    }
  };

  // Rendering Helper Methods
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#10b981', fontSize: 15 }} />;
      case 'processing':
        return <LoadingOutlined style={{ color: '#3b82f6', fontSize: 15 }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 15 }} />;
      case 'skipped':
        return <MinusOutlined style={{ color: '#9ca3af', fontSize: 15 }} />;
      default:
        return <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid #d1d5db' }} />;
    }
  };

  const getAgentColor = (agent: string) => {
    const map: Record<string, string> = {
      'Chief Agent': '#009688',
      'Code Agent': '#3b82f6',
      'File Agent': '#10b981',
      'Database Agent': '#f59e0b',
      'Deploy Agent': '#8b5cf6',
      'Server Agent': '#ec4899',
      'Monitoring Agent': '#06b6d4',
      'Security Agent': '#ef4444'
    };
    return map[agent] || '#6b7280';
  };

  const modelMenu = (
    <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '4px 0', minWidth: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '4px 12px 6px', color: '#6b7280', fontSize: 11, fontWeight: 600 }}>{t('ai.modelMenuLabel')}</div>
      {[
        'Gemini 3.5 Flash (High)',
        'Gemini 3.5 Pro',
        'Claude 3.5 Sonnet',
        'OpenAI Operator (GPT-4o)'
      ].map(m => (
        <div
          key={m}
          style={{ padding: '6px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#111827', fontSize: 13 }}
          onClick={() => {
            setSelectedModel(m);
            setModelMenuOpen(false);
          }}
          className="light-hover"
        >
          {m}
          {selectedModel === m && <CheckOutlined style={{ color: '#009688' }} />}
        </div>
      ))}
    </div>
  );

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(convoSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', margin: '-16px -24px', background: '#fcfcfc', fontFamily: '"Inter", sans-serif', color: '#111827', overflow: 'hidden' }}>
      
      {/* 1️⃣ LEFT SIDEBAR: Conversations, Tasks, Memories */}
      <div style={{ width: 280, height: '100%', borderRight: '1px solid #e5e7eb', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ height: 56, boxSizing: 'border-box', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
          <Space>
            <RobotOutlined style={{ fontSize: 18, color: '#009688' }} />
            <Text style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>KPanel AI Agent</Text>
          </Space>
          <Tooltip title={t('ai.msgSuccessCreateConvo')}>
            <Button size="small" type="primary" shape="circle" icon={<PlusOutlined />} onClick={handleCreateConvo} style={{ background: '#009688', border: 'none' }} />
          </Tooltip>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 12px 8px' }}>
          <Input 
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} 
            placeholder={t('ai.searchPlaceholder')} 
            value={convoSearch}
            onChange={e => setConvoSearch(e.target.value)}
            style={{ borderRadius: 6, border: '1px solid #cbd5e1' }}
            allowClear
          />
        </div>

        {/* Inner Sidebar tabs */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
          
          {/* Section: Conversations History */}
          <div style={{ marginBottom: 20 }}>
            <List
              size="small"
              split={false}
              dataSource={filteredConversations}
              renderItem={c => (
                <div
                  onClick={() => setActiveConvoId(c.id)}
                  style={{
                    padding: '8px 10px',
                    cursor: 'pointer',
                    borderRadius: 6,
                    marginBottom: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: activeConvoId === c.id ? '#e0f2fe' : 'transparent',
                    border: activeConvoId === c.id ? '1px solid #bae6fd' : '1px solid transparent',
                    transition: 'all 0.15s'
                  }}
                  className={`chat-history-item-hover ${activeConvoId === c.id ? 'active-convo' : ''}`}
                >
                  <Space style={{ overflow: 'hidden', width: '85%' }}>
                    <MessageOutlined style={{ color: activeConvoId === c.id ? '#0284c7' : '#64748b', fontSize: 14 }} />
                    <Text ellipsis style={{ fontSize: 13, color: activeConvoId === c.id ? '#0369a1' : '#334155', fontWeight: activeConvoId === c.id ? 600 : 400 }}>
                      {c.title}
                    </Text>
                  </Space>
                  <Popconfirm
                    title={t('ai.confirmDeleteConvo')}
                    okText={t('ai.btnYes')}
                    cancelText={t('ai.btnNo')}
                    onConfirm={(e: any) => handleDeleteConvo(c.id, e)}
                  >
                    <DeleteOutlined className="delete-icon" style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }} onClick={e => e.stopPropagation()} />
                  </Popconfirm>
                </div>
              )}
            />
            {filteredConversations.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{t('ai.noConversations')}</div>
            )}
          </div>



        </div>

        {/* Setting Footer */}
        <div style={{ padding: 12, borderTop: '1px solid #e2e8f0', background: '#f1f5f9' }}>
          <Space style={{ cursor: 'pointer' }} className="light-hover">
            <SettingOutlined style={{ color: '#475569' }} />
            <Text style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{t('ai.titleConfig')}</Text>
          </Space>
        </div>
      </div>

      {/* 2️⃣ MAIN CHAT PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative' }}>
        
        {/* Chat Title / Action bar */}
        <div style={{ height: 56, boxSizing: 'border-box', padding: '0 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong style={{ fontSize: 15, color: '#0f172a' }}>
              {activeConvoId ? conversations.find(c => c.id === activeConvoId)?.title : t('ai.placeholderSelectConvo')}
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: 11, color: '#64748b' }}>{t('ai.textContextLoaded')}</span>
            </div>
          </div>
          
          <Space>
            <Button size="small" icon={<SyncOutlined />} onClick={() => activeConvoId && loadMessages(activeConvoId)}>{t('ai.btnRefresh')}</Button>
          </Space>
        </div>

        {/* Message Stream Area */}
        <div className="message-stream-container" style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            
            {messages.length === 0 && !loading && (
              <div style={{ textAlign: 'center', marginTop: 80, padding: 24 }}>
                <RobotOutlined style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 16 }} />
                <Title level={4} style={{ color: '#334155' }}>{t('ai.welcomeTitle')}</Title>
                <Text style={{ color: '#64748b', fontSize: 14 }}>
                  {t('ai.welcomeSub')}
                </Text>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '24px auto 0' }}>
                  {[
                    { text: t('ai.suggLaravel'), query: t('ai.suggLaravelQuery') },
                    { text: t('ai.suggPostgres'), query: t('ai.suggPostgresQuery') },
                    { text: t('ai.suggSlowQueries'), query: t('ai.suggSlowQueriesQuery') },
                    { text: t('ai.suggDeleteProject'), query: t('ai.suggDeleteProjectQuery') }
                  ].map((s, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setInputText(s.query)}
                      style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', textAlign: 'left', background: '#f8fafc', transition: 'all 0.15s' }}
                      className="suggestion-box-hover"
                    >
                      <Text style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{s.text}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', marginBottom: 32, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                
                <div style={{ 
                  width: m.role === 'assistant' ? '100%' : 'auto', 
                  maxWidth: m.role === 'assistant' ? '100%' : '85%',
                  marginLeft: m.role === 'user' ? 'auto' : undefined
                }}>
                  
                  {/* User message block */}
                  {m.role === 'user' ? (
                    <div style={{ background: '#f1f5f9', padding: '12px 18px', borderRadius: '18px 18px 2px 18px', border: '1px solid #e2e8f0' }}>
                      <Text style={{ fontSize: 14.5, color: '#0f172a', whiteSpace: 'pre-wrap' }}>{m.content}</Text>
                    </div>
                  ) : (
                    // Assistant multi-pane rendering
                    <div style={{ padding: '4px 0' }}>
                      
                      {/* 🧠 Thinking Process Block */}
                      {m.thinkingProcess && (
                        <Collapse 
                          ghost 
                          style={{ 
                            background: '#f8fafc', 
                            borderLeft: '3px solid #009688', 
                            borderRadius: '0 8px 8px 0', 
                            marginBottom: 16,
                            borderTop: '1px solid #e2e8f0',
                            borderRight: '1px solid #e2e8f0',
                            borderBottom: '1px solid #e2e8f0',
                          }} 
                          defaultActiveKey={[]}
                        >
                          <Collapse.Panel 
                            header={
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#475569', fontSize: 12.5 }}>
                                  <RobotOutlined style={{ color: '#009688' }} />
                                  <span>{t('ai.textThinkingDone')}</span>
                                </div>
                                <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', paddingRight: 8 }}>{t('ai.textThinkingDuration')}</span>
                              </div>
                            }
                            key="thinking"
                          >
                            <div style={{ 
                              whiteSpace: 'pre-wrap', 
                              fontFamily: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace', 
                              fontSize: 12, 
                              color: '#64748b', 
                              lineHeight: '18px', 
                              padding: '10px 14px',
                              background: '#ffffff',
                              borderTop: '1px solid #f1f5f9',
                              borderRadius: 4,
                              margin: '0 4px 4px'
                            }}>
                              {m.thinkingProcess}
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      )}

                      {/* Markdown Text Response */}
                      <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#334155', marginBottom: 16 }}>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                      </div>

                      {/* 🔄 Plan stepper tree */}
                      {m.plan && m.plan.length > 0 && (
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <PlayCircleOutlined /> {t('ai.titlePlanning')}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {m.plan.map(step => (
                              <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                {getStepIcon(step.status)}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: step.status === 'processing' ? '#3b82f6' : '#1e293b' }}>
                                    {step.step}
                                  </span>
                                  {step.description && (
                                    <span style={{ fontSize: 12, color: '#64748b' }}>{step.description}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 👥 Sub-agents log status */}
                      {m.subAgentLogs && m.subAgentLogs.length > 0 && (
                        <Collapse ghost style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 16 }}>
                          <Collapse.Panel 
                            header={<div style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <UserOutlined /> {t('ai.titleSubagents').replace('{n}', m.subAgentLogs.length.toString())}
                            </div>}
                            key="subagents"
                          >
                            <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {m.subAgentLogs.map((l, idx) => (
                                <div key={idx} style={{ fontSize: 12, display: 'flex', gap: 8, borderLeft: `3px solid ${getAgentColor(l.agent)}`, paddingLeft: 8 }}>
                                  <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{l.timestamp}</span>
                                  <span style={{ fontWeight: 700, color: getAgentColor(l.agent) }}>{l.agent}:</span>
                                  <span style={{ color: '#334155' }}>{l.message}</span>
                                </div>
                              ))}
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      )}

                      {/* 🛠️ Tool calls & console previews */}
                      {m.toolUsages && m.toolUsages.length > 0 && (
                        <div style={{ background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b', overflow: 'hidden', marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '6px 12px' }}>
                            <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>{t('ai.consoleTitle')}</span>
                            <Tooltip title={t('ai.tooltipCopyCmd')}>
                              <CopyOutlined 
                                style={{ color: '#94a3b8', cursor: 'pointer' }} 
                                onClick={() => {
                                  const cmd = m.toolUsages?.map(t => t.command).join('\n');
                                  if (cmd) { navigator.clipboard.writeText(cmd); message.success(t('ai.msgCopyCmdSuccess')); }
                                }}
                              />
                            </Tooltip>
                          </div>
                          <div style={{ padding: '12px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#cbd5e1', overflowX: 'auto' }}>
                            {m.toolUsages.map((t, idx) => (
                              <div key={idx} style={{ marginBottom: 6 }}>
                                <span style={{ color: '#38bdf8' }}>$ {t.command}</span>
                                {t.output && <div style={{ color: '#94a3b8', marginLeft: 12, whiteSpace: 'pre-wrap' }}>{t.output}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 📋 Sensitive approvals actions request card */}
                      {m.approvals && m.approvals.filter(a => a.status === 'pending').map((app) => (
                        <div key={app.id} style={{ border: '2px solid #f59e0b', borderRadius: 8, background: '#fffbeb', padding: 16, marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                            <ExclamationCircleOutlined /> {t('ai.approvalTitle')}
                          </div>
                          <Row gutter={[16, 8]} style={{ marginBottom: 12 }}>
                            <Col span={8}><Text style={{ color: '#78350f', fontSize: 12 }} strong>{t('ai.approvalAction')}</Text></Col>
                            <Col span={16}><Tag color="warning" style={{ fontSize: 12 }}>{app.action}</Tag></Col>
                            
                            <Col span={8}><Text style={{ color: '#78350f', fontSize: 12 }} strong>{t('ai.approvalTarget')}</Text></Col>
                            <Col span={16}><Text style={{ color: '#78350f', fontSize: 12, fontFamily: 'monospace' }}>{app.target}</Text></Col>

                            {app.details && (
                              <>
                                <Col span={8}><Text style={{ color: '#78350f', fontSize: 12 }} strong>{t('ai.approvalDetails')}</Text></Col>
                                <Col span={16}><Text style={{ color: '#78350f', fontSize: 12 }}>{app.details}</Text></Col>
                              </>
                            )}
                          </Row>
                          <Space>
                            <Button type="primary" size="small" style={{ background: '#10b981', borderColor: '#10b981' }} icon={<CheckOutlined />} onClick={() => handleApprove(m.id, app.id, 'approved')}>
                              {t('ai.btnApprove')}
                            </Button>
                            <Button danger size="small" type="primary" icon={<CloseCircleOutlined />} onClick={() => handleApprove(m.id, app.id, 'rejected')}>
                              {t('ai.btnReject')}
                            </Button>
                          </Space>
                        </div>
                      ))}

                    </div>
                  )}
                  <span style={{ fontSize: 10, color: '#94a3b8', display: 'block', textAlign: m.role === 'user' ? 'right' : 'left', marginTop: 4 }}>
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </span>
                </div>

              </div>
            ))}

            {sending && (
              <div style={{ display: 'flex', marginBottom: 32, alignItems: 'flex-start', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    background: '#f8fafc', 
                    borderLeft: '3px solid #009688', 
                    borderRadius: '0 8px 8px 0', 
                    padding: '14px 18px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    borderTop: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="thinking-pulse-dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#009688' }}></span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#009688' }}>{t('ai.textAgentThinking')}</span>
                      </div>
                      <span className="thinking-timer" style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>{t('ai.textAgentProcessing')}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: thinkingStep >= 0 ? '#334155' : '#cbd5e1' }}>
                        {thinkingStep === 0 ? <LoadingOutlined style={{ color: '#009688' }} /> : thinkingStep > 0 ? <CheckCircleOutlined style={{ color: '#10b981' }} /> : <span style={{ width: 14 }}></span>}
                        <span style={{ fontWeight: thinkingStep === 0 ? 500 : 400 }}>{t('ai.stepAnalysis')}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: thinkingStep >= 1 ? '#334155' : '#cbd5e1' }}>
                        {thinkingStep === 1 ? <LoadingOutlined style={{ color: '#009688' }} /> : thinkingStep > 1 ? <CheckCircleOutlined style={{ color: '#10b981' }} /> : <span style={{ width: 14 }}></span>}
                        <span style={{ fontWeight: thinkingStep === 1 ? 500 : 400 }}>{t('ai.stepReadMemory')}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: thinkingStep >= 2 ? '#334155' : '#cbd5e1' }}>
                        {thinkingStep === 2 ? <LoadingOutlined style={{ color: '#009688' }} /> : thinkingStep > 2 ? <CheckCircleOutlined style={{ color: '#10b981' }} /> : <span style={{ width: 14 }}></span>}
                        <span style={{ fontWeight: thinkingStep === 2 ? 500 : 400 }}>{t('ai.stepPlanning')}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: thinkingStep >= 3 ? '#334155' : '#cbd5e1' }}>
                        {thinkingStep === 3 ? <LoadingOutlined style={{ color: '#009688' }} /> : <span style={{ width: 14 }}></span>}
                        <span style={{ fontWeight: thinkingStep === 3 ? 500 : 400 }}>{t('ai.stepPreparing')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Toolbar (Claude Code / Antigravity Style) */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 20px',
          flexShrink: 0
        }}>
          <div 
            style={{
              width: '100%', maxWidth: 880, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 16,
              padding: '10px 14px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              transition: 'border-color 0.2s'
            }}
            className="chat-input-container"
          >
            <Input.TextArea
              placeholder={t('ai.placeholderInput')}
              autoSize={{ minRows: 1, maxRows: 6 }}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  if (inputText.trim()) handleSendMessage();
                }
              }}
              style={{
                border: 'none', boxShadow: 'none', resize: 'none', background: 'transparent',
                color: '#0f172a', fontSize: 14.5, padding: 0, margin: 0, lineHeight: '22px',
                overflow: 'hidden', borderRadius: 0
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <Dropdown overlay={modelMenu} trigger={['click']} open={modelMenuOpen} onOpenChange={setModelMenuOpen}>
                  <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{selectedModel}</span>
                    <DownOutlined style={{ fontSize: 10, color: '#64748b' }} />
                  </div>
                </Dropdown>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <Switch 
                    size="small" 
                    checked={thinkingEnabled} 
                    onChange={setThinkingEnabled} 
                  />
                  <Text style={{ fontSize: 12, color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>{t('ai.textThinking')}</Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div 
                  onClick={handleSendMessage}
                  style={{
                    background: inputText.trim() ? '#009688' : '#f1f5f9',
                    color: inputText.trim() ? '#ffffff' : '#cbd5e1',
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: inputText.trim() ? 'pointer' : 'default', transition: 'all 0.15s'
                  }}
                >
                  <ArrowUpOutlined style={{ fontSize: 15, fontWeight: 'bold' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3️⃣ RIGHT PANEL: Multi-tab context, files, tasks tree, logs, approvals */}
      <div style={{ width: 360, height: '100%', borderLeft: '1px solid #e5e7eb', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        
        {/* Navigation Tabs */}
        <div style={{ height: 56, boxSizing: 'border-box', padding: '0 16px', background: '#ffffff', display: 'flex', alignItems: 'flex-end' }}>
          <Tabs 
            activeKey={rightPanelTab} 
            onChange={setRightPanelTab}
            size="small"
            tabBarGutter={18}
            tabBarStyle={{ margin: 0 }}
            items={[
              { key: 'context', label: <Tooltip title={t('ai.tooltipContext')}><Space size={6}><InfoCircleOutlined />{t('ai.tabContext')}</Space></Tooltip> },
              { key: 'files', label: <Tooltip title={t('ai.tooltipFiles')}><Space size={6}><FileTextOutlined />{t('ai.tabFiles')}</Space></Tooltip> },
              { key: 'tasks', label: <Tooltip title={t('ai.tooltipTasks')}><Space size={6}><CheckOutlined />{t('ai.tabTasks')}</Space></Tooltip> },
              { key: 'logs', label: <Tooltip title={t('ai.tooltipLogs')}><Space size={6}><HistoryOutlined />{t('ai.tabLogs')}</Space></Tooltip> }
            ]}
          />
        </div>

        {/* Tab Contents */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

          {/* Context Tab */}
          {rightPanelTab === 'context' && (
            <div>
              <Title level={5} style={{ fontSize: 13, color: '#334155', marginBottom: 12 }}>
                {t('ai.titleActiveScope')}
              </Title>
              
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <Text strong style={{ fontSize: 12, color: '#64748b' }}>{t('ai.activeProjects').replace('{count}', projectsList.length.toString())}</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {projectsList.map(p => (
                    <Tag key={p.id} color={p.status === 'running' ? 'green' : 'default'} style={{ margin: 0 }}>
                      <ProjectOutlined /> {p.name}
                    </Tag>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <Text strong style={{ fontSize: 12, color: '#64748b' }}>{t('ai.activeDatabases').replace('{count}', databasesList.length.toString())}</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {databasesList.map(d => (
                    <Tag key={d.id} color="blue" style={{ margin: 0 }}>
                      <DatabaseOutlined /> {d.name} ({d.type})
                    </Tag>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
                <Text strong style={{ fontSize: 12, color: '#64748b' }}>{t('ai.agentScopeInfo')}</Text>
                <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                  <Col span={12}><Text style={{ fontSize: 11, color: '#64748b' }}>{t('ai.dirPathLabel')}</Text></Col>
                  <Col span={12}><Text style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>/d/DATA/source/Kpanel</Text></Col>
                  
                  <Col span={12}><Text style={{ fontSize: 11, color: '#64748b' }}>{t('ai.sshCmdLabel')}</Text></Col>
                  <Col span={12}><Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>{t('ai.envSafeTag')}</Tag></Col>

                  <Col span={12}><Text style={{ fontSize: 11, color: '#64748b' }}>{t('ai.approvalLevelLabel')}</Text></Col>
                  <Col span={12}><Tag color="warning" style={{ fontSize: 10, margin: 0 }}>{t('ai.alwaysAskTag')}</Tag></Col>
                </Row>
              </div>
            </div>
          )}

          {/* Files Tab (Diff Viewer) */}
          {rightPanelTab === 'files' && (
            <div>
              <Title level={5} style={{ fontSize: 13, color: '#334155', marginBottom: 12 }}>
                {t('ai.titleModifiedFiles')}
              </Title>

              {/* Find last assistant messages to list touched files */}
              {(() => {
                const assistants = messages.filter(m => m.role === 'assistant' && m.filesTouched && m.filesTouched.length > 0);
                if (assistants.length === 0) {
                  return <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 24 }}>{t('ai.noModifiedFiles')}</div>;
                }
                
                const allFiles = assistants.flatMap(m => m.filesTouched || []);

                return (
                  <div>
                    <List
                      size="small"
                      dataSource={allFiles}
                      renderItem={file => (
                        <div
                          onClick={() => setSelectedFileDiff(file)}
                          style={{
                            padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: selectedFileDiff?.filepath === file.filepath ? '#ffffff' : 'transparent',
                            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, transition: 'all 0.15s'
                          }}
                        >
                          <Space style={{ overflow: 'hidden', width: '70%' }}>
                            <FileTextOutlined style={{ color: '#009688' }} />
                            <Text ellipsis style={{ fontSize: 12, fontFamily: 'monospace', color: '#334155' }}>{file.filepath.split('/').pop()}</Text>
                          </Space>
                          <Tag color={file.status === 'created' ? 'green' : 'blue'} style={{ fontSize: 10, margin: 0 }}>{file.status}</Tag>
                        </div>
                      )}
                    />

                    {selectedFileDiff && (
                      <div style={{ marginTop: 16 }}>
                        <Text strong style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
                          {t('ai.diffHeader').replace('{file}', selectedFileDiff.filepath.split('/').pop() || '')}
                        </Text>
                        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 6, overflowX: 'auto', maxHeight: 350 }}>
                          <pre style={{ margin: 0, padding: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#cbd5e1', lineHeight: '18px' }}>
                            {selectedFileDiff.diff || t('ai.noDiffRecorded')}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Tasks Tab (Tasks Tree/Queue) */}
          {rightPanelTab === 'tasks' && (
            <div>
              <Title level={5} style={{ fontSize: 13, color: '#334155', marginBottom: 12 }}>
                {t('ai.titleTasksQueue')}
              </Title>
              <List
                size="small"
                dataSource={tasksList}
                renderItem={task => (
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text strong style={{ fontSize: 13, color: '#1e293b' }}>{task.title}</Text>
                      <Tag color={task.status === 'completed' ? 'success' : task.status === 'running' ? 'processing' : 'default'} style={{ margin: 0 }}>
                        {task.status === 'completed' ? t('ai.taskStatusCompleted') : task.status === 'running' ? t('ai.taskStatusRunning') : t('ai.taskStatusPending')}
                      </Tag>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                      <span>Agent: {task.agent}</span>
                      <span>Tiến độ: {task.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: '#f1f5f9', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${task.progress}%`, height: '100%', background: task.status === 'completed' ? '#10b981' : '#3b82f6', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>
                )}
              />
              {tasksList.length === 0 && (
                <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 24 }}>{t('ai.noActiveTasks')}</div>
              )}
            </div>
          )}

          {/* Audit Logs Tab */}
          {rightPanelTab === 'logs' && (
            <div>
              <Title level={5} style={{ fontSize: 13, color: '#334155', marginBottom: 12 }}>
                {t('ai.titleActivityLogs')}
              </Title>
              
              {/* Load logs from conversations */}
              {(() => {
                const assistants = messages.filter(m => m.role === 'assistant' && m.subAgentLogs && m.subAgentLogs.length > 0);
                if (assistants.length === 0) {
                  return <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 24 }}>{t('ai.noActivityLogs')}</div>;
                }
                const logs = assistants.flatMap(m => m.subAgentLogs || []);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {logs.map((l, idx) => (
                      <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: getAgentColor(l.agent) }}>{l.agent}</span>
                          <span style={{ fontSize: 9, color: '#94a3b8' }}>{l.timestamp}</span>
                        </div>
                        <span style={{ fontSize: 11.5, color: '#334155' }}>{l.message}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>



      <style>{`
        /* AI Center overrides & custom visuals */
        .chat-history-item-hover:not(.active-convo):hover {
          background-color: #f1f5f9 !important;
        }
        .chat-history-item-hover:hover .delete-icon {
          color: #ef4444 !important;
        }
        .suggestion-box-hover:hover {
          border-color: #009688 !important;
          background-color: #f0fdf4 !important;
        }
        .light-hover:hover {
          opacity: 0.8;
        }
        .chat-input-container:focus-within {
          border-color: #009688 !important;
        }
        .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        @keyframes thinkingPulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        .thinking-pulse-dot {
          animation: thinkingPulse 1.5s infinite ease-in-out;
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-slow {
          animation: spinSlow 8s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default AICenter;
