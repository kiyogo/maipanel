import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Maximize2, RotateCcw, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function WebTerminalModal({ isOpen, onClose, server }) {
  const { success } = useToast();
  const [history, setHistory] = useState([
    `Connecting to ${server?.ip || '103.145.62.110'}:22 via secure VNC/WebSocket...`,
    `Connected to ${server?.name || 'prod-api-server'}. Host key fingerprint is SHA256:Nx7881...`,
    `Welcome to ${server?.osName || 'Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)'}`,
    ` * Documentation:  https://help.ubuntu.com`,
    ` * Management:     https://nexuscloud.vn/docs`,
    ` * Support:        https://nexuscloud.vn/dashboard/tickets`,
    ``,
    `System information as of ${new Date().toUTCString()}:`,
    `  System load:  0.28, 0.35, 0.41      Processes:             142`,
    `  Usage of /:   38.0% of 80GB         Users logged in:       1`,
    `  Memory usage: 54.2%                 IPv4 address for eth0: ${server?.ip || '103.145.62.110'}`,
    ``,
    `Last login: Mon Mar 10 14:20:15 2026 from 113.190.244.12`,
    `Type 'help' to see available commands or explore the system.`
  ]);

  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newHistory = [...history, `root@${server?.name || 'nexus-srv'}:~# ${cmd}`];

    switch (cmd.toLowerCase()) {
      case 'help':
        newHistory.push(
          `Available commands:`,
          `  neofetch      - Display server architecture & specs`,
          `  uptime        - Show server uptime & load average`,
          `  free -m       - Show memory (RAM) usage`,
          `  df -h         - Show NVMe disk partition usage`,
          `  ip a          - Show network interface & IP configuration`,
          `  uname -a      - Show Linux kernel version`,
          `  status        - Check services (nginx, docker, mysql)`,
          `  clear         - Clear terminal screen`
        );
        break;
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      case 'neofetch':
        newHistory.push(
          `       _,met$$$$$gg.          root@${server?.name || 'nexus-srv'}`,
          `    ,g$$$$$$$$$$$$$$$P.       -----------------------------`,
          `  ,g$$P"     """Y$$.".        OS: ${server?.osName || 'Ubuntu 24.04 LTS x86_64'}`,
          ` ,$$P'              \`$$$.     Host: Nexus Cloud KVM Virtual Machine`,
          `',$$P       ,ggs.     \`$$b:   Kernel: 6.8.0-31-generic`,
          `\`d$$'     ,$P"'   .    $$$    Uptime: ${server?.metrics?.uptimeHours || 348} hours`,
          ` $$P      d$'     ,    $$P    Packages: 684 (dpkg)`,
          ` $$:      $$.   -    ,d$$'    Shell: bash 5.2.21`,
          ` $$;      Y$b._   _,d$P'      CPU: AMD EPYC™ 9004 (${server?.specs?.cpu || 4} vCPU)`,
          ` Y$$.    \`."Y$$$$P"'          Memory: ${(server?.metrics?.ramUsage * 80).toFixed(0)}MB / ${server?.specs?.ram || 8}192MB`,
          `  \`$$b      "-.__             Disk: ${server?.specs?.storage || 80}GB NVMe Enterprise`
        );
        break;
      case 'uptime':
        newHistory.push(
          ` 14:35:10 up ${Math.floor((server?.metrics?.uptimeHours || 348) / 24)} days,  2 users,  load average: 0.28, 0.35, 0.41`
        );
        break;
      case 'free -m':
      case 'free':
        newHistory.push(
          `               total        used        free      shared  buff/cache   available`,
          `Mem:            8192        4440        2150         128        1602        3752`,
          `Swap:           2048         120        1928`
        );
        break;
      case 'df -h':
        newHistory.push(
          `Filesystem      Size  Used Avail Use% Mounted on`,
          `/dev/vda1        80G   31G   49G  38% /`,
          `tmpfs           3.9G     0  3.9G   0% /dev/shm`,
          `/dev/vda15      105M  6.1M   99M   6% /boot/efi`
        );
        break;
      case 'ip a':
      case 'ifconfig':
        newHistory.push(
          `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN`,
          `    inet 127.0.0.1/8 scope host lo`,
          `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP`,
          `    inet ${server?.ip || '103.145.62.110'}/24 brd 103.145.62.255 scope global eth0`,
          `    inet6 ${server?.ipv6 || '2405:4803:c001:110::1'}/64 scope global`
        );
        break;
      case 'status':
      case 'service nginx status':
        newHistory.push(
          `● nginx.service - A high performance web server and a reverse proxy server`,
          `     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled)`,
          `     Active: active (running) since Mon 2026-03-01 02:00:10 UTC; 9 days ago`,
          `   Main PID: 894 (nginx)`,
          `      Tasks: 5 (limit: 9482)`
        );
        break;
      default:
        newHistory.push(`bash: ${cmd}: command not found. Type 'help' for command list.`);
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-xl"
        style={{ padding: 0, backgroundColor: '#0B0F19', border: '1px solid #1E293B' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="terminal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="terminal-dots">
              <div className="terminal-dot red" onClick={onClose} style={{ cursor: 'pointer' }}></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              Web Console (VNC) - root@{server?.name || 'nexus-srv'} ({server?.ip || '103.145.62.110'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Connected 100%
            </span>
            <button onClick={onClose} style={{ color: '#94A3B8', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="terminal-body" style={{ height: '440px', overflowY: 'auto' }}>
          {history.map((line, idx) => (
            <div key={idx} className="terminal-line" style={{ color: line.startsWith('root@') ? '#A3E635' : '#E2E8F0' }}>
              {line}
            </div>
          ))}

          {/* Interactive Command Input Line */}
          <form onSubmit={handleCommand} className="terminal-input-line">
            <span className="terminal-prompt">root@{server?.name || 'nexus-srv'}:~#</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              autoFocus
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

export function ServerMetricsChart({ server }) {
  const metrics = server?.metrics || {
    cpuUsage: 28.4,
    ramUsage: 54.2,
    diskUsage: 38.0,
    networkIn: 45.2,
    networkOut: 89.6
  };

  const getStatusColorClass = (val) => {
    if (val >= 85) return 'danger';
    if (val >= 70) return 'warning';
    return '';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
      {/* CPU Metric */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div className="resource-header">
          <span style={{ color: 'var(--text-secondary)' }}>CPU ({server?.specs?.cpu || 4} vCPU)</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.cpuUsage}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${getStatusColorClass(metrics.cpuUsage)}`} style={{ width: `${metrics.cpuUsage}%` }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
          AMD EPYC™ Gen4 3.4GHz
        </div>
      </div>

      {/* RAM Metric */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div className="resource-header">
          <span style={{ color: 'var(--text-secondary)' }}>RAM ({server?.specs?.ram || 8} GB)</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.ramUsage}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${getStatusColorClass(metrics.ramUsage)}`} style={{ width: `${metrics.ramUsage}%` }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
          {((metrics.ramUsage / 100) * (server?.specs?.ram || 8)).toFixed(1)} GB / {server?.specs?.ram || 8} GB DDR4 ECC
        </div>
      </div>

      {/* Disk Metric */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div className="resource-header">
          <span style={{ color: 'var(--text-secondary)' }}>Ổ cứng NVMe ({server?.specs?.storage || 80} GB)</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.diskUsage}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${metrics.diskUsage}%` }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
          {((metrics.diskUsage / 100) * (server?.specs?.storage || 80)).toFixed(1)} GB / {server?.specs?.storage || 80} GB (RAID 10)
        </div>
      </div>

      {/* Network Traffic */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div className="resource-header">
          <span style={{ color: 'var(--text-secondary)' }}>Lưu lượng mạng BGP</span>
          <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{metrics.networkOut} Mbps</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ flex: 1, padding: '0.375rem', backgroundColor: 'var(--bg-card)', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Inbound ↓</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.networkIn} Mbps</div>
          </div>
          <div style={{ flex: 1, padding: '0.375rem', backgroundColor: 'var(--bg-card)', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Outbound ↑</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.networkOut} Mbps</div>
          </div>
        </div>
      </div>
    </div>
  );
}
