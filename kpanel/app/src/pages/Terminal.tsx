import React, { useRef, useState, useEffect } from 'react';
import { Typography, Select, message } from '../custom-ui';
import { CodeOutlined } from '@ant-design/icons';
import { serversApi } from '../api/endpoints';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

interface TerminalLine {
  text: string;
  color: string;
}

const Terminal: React.FC = () => {
  const { t } = useLanguage();
  const [servers, setServers] = useState<Array<{ id: string; name: string; ip: string }>>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load danh sách servers để chọn SSH
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await serversApi.getAll();
        setServers(res.data);
        if (res.data.length > 0) {
          setSelectedServer(res.data[0].name);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchServers();
  }, []);

  // Thiết lập ban đầu khi đổi server
  useEffect(() => {
    if (!selectedServer) return;
    setHistory([
      { text: `Connecting to ${selectedServer} via SSH on port 22...`, color: '#009688' },
      { text: `Connection established. Welcome to Ubuntu 22.04 LTS (GNU/Linux 5.15.0-x86_64)`, color: '#888' },
      { text: `Last login: ${new Date().toLocaleString()} from kpanel-client`, color: '#888' },
      { text: `Type 'help' to see list of simulated commands.`, color: '#FF9800' },
      { text: `root@${selectedServer.toLowerCase()}:~$ `, color: '#009688' },
    ]);
  }, [selectedServer]);

  // Cuộn xuống cuối terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = inputVal.trim();
      if (!command) return;

      const newHistory = [...history];
      // Cập nhật dòng lệnh vừa gõ (ghi đè vào prompt cuối cùng)
      if (newHistory.length > 0) {
        newHistory[newHistory.length - 1].text += command;
      }

      const cmdLower = command.toLowerCase();
      let output: TerminalLine[] = [];

      if (cmdLower === 'clear') {
        setHistory([{ text: `root@${selectedServer.toLowerCase()}:~$ `, color: '#009688' }]);
        setInputVal('');
        return;
      } else if (cmdLower === 'help') {
        output = [
          { text: 'Available simulated commands:', color: '#bbb' },
          { text: '  uptime     - Show server uptime', color: '#888' },
          { text: '  df -h      - Show disk space usage', color: '#888' },
          { text: '  docker ps  - List running containers', color: '#888' },
          { text: '  free -m    - Show RAM usage in MB', color: '#888' },
          { text: '  uname -a   - Show kernel and system info', color: '#888' },
          { text: '  ls         - List files in current directory', color: '#888' },
          { text: '  whoami     - Show current user', color: '#888' },
          { text: '  clear      - Clear terminal screen', color: '#888' },
        ];
      } else if (cmdLower === 'uptime') {
        output = [{ text: ` 12:50:31 up 18 days, 11:45,  1 user,  load average: 0.12, 0.28, 0.31`, color: '#bbb' }];
      } else if (cmdLower === 'df -h') {
        output = [
          { text: 'Filesystem      Size  Used Avail Use% Mounted on', color: '#bbb' },
          { text: '/dev/sda1        80G   32G   48G  40% /', color: '#bbb' },
          { text: 'tmpfs           3.9G     0  3.9G   0% /dev/shm', color: '#bbb' },
        ];
      } else if (cmdLower === 'docker ps') {
        output = [
          { text: 'CONTAINER ID   IMAGE                 COMMAND                  CREATED        STATUS        PORTS     NAMES', color: '#bbb' },
          { text: 'a12b3c4d5e6f   postgres:16-alpine    "docker-entrypoint.s…"   2 days ago     Up 48 hours             kpanel_postgres', color: '#bbb' },
          { text: 'f98e7d6c5b4a   redis:alpine          "docker-entrypoint.s…"   2 days ago     Up 48 hours             kpanel_redis', color: '#bbb' },
        ];
      } else if (cmdLower === 'free -m') {
        output = [
          { text: '               total        used        free      shared  buff/cache   available', color: '#bbb' },
          { text: 'Mem:            8048        3211        1244         112        3593        4420', color: '#bbb' },
          { text: 'Swap:           2048         102        1946', color: '#bbb' },
        ];
      } else if (cmdLower === 'uname -a') {
        output = [{ text: `Linux ${selectedServer.toLowerCase()} 5.15.0-88-generic #98-Ubuntu SMP Mon Oct 2 15:18:56 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux`, color: '#bbb' }];
      } else if (cmdLower === 'whoami') {
        output = [{ text: 'root', color: '#bbb' }];
      } else if (cmdLower === 'ls') {
        output = [{ text: 'apps/  backups/  docker-compose.yml  logs/  nginx.conf  website/', color: '#4CAF50' }];
      } else {
        output = [{ text: `bash: ${command}: command not found`, color: '#F44336' }];
      }

      // Đẩy output vào history, sau đó chèn prompt mới
      setHistory([
        ...newHistory,
        ...output,
        { text: `root@${selectedServer.toLowerCase()}:~$ `, color: '#009688' },
      ]);
      setInputVal('');
    }
  };

  const serverOptions = servers.map(s => ({ label: s.name, value: s.name }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>

        <Select
          value={selectedServer || undefined}
          onChange={setSelectedServer}
          options={serverOptions}
          style={{ width: 180 }}
          placeholder={t('terminal.selectPlaceholder')}
          notFoundContent={t('terminal.notFoundContent')}
        />
      </div>

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #E0E0E0' }}>
        {/* Terminal header */}
        <div style={{ background: '#1A1A1A', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F44336', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF9800', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4CAF50', display: 'inline-block' }} />
          <Text style={{ color: '#888', marginLeft: 8, fontSize: 12 }}>
            {selectedServer ? `${selectedServer} – bash` : t('terminal.noActiveConnection')}
          </Text>
        </div>

        {/* Output */}
        <div style={{
          background: '#111',
          padding: 20,
          minHeight: 440,
          maxHeight: 500,
          fontFamily: '"Fira Code","Cascadia Code","Courier New",monospace',
          fontSize: 13,
          lineHeight: 1.7,
          overflowY: 'auto',
        }}>
          {history.map((l, i) => (
            <div key={i} style={{ color: l.color, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {l.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          background: '#1A1A1A',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderTop: '1px solid #333',
        }}>
          <CodeOutlined style={{ color: '#009688' }} />
          <input
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#E0E0E0',
              fontFamily: 'monospace',
              fontSize: 13,
            }}
            placeholder={selectedServer ? t('terminal.inputPlaceholderActive') : t('terminal.inputPlaceholderInactive')}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleCommand}
            disabled={!selectedServer}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
