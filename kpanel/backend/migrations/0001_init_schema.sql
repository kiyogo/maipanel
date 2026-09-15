-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Viewer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Servers table
CREATE TABLE IF NOT EXISTS servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    ip VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    os VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'offline',
    cpu INT NOT NULL DEFAULT 0,
    ram INT NOT NULL DEFAULT 0,
    disk INT NOT NULL DEFAULT 0,
    ssh_port INT,
    notes TEXT,
    gpu INT NOT NULL DEFAULT 0,
    temperature VARCHAR(50),
    uptime VARCHAR(100),
    network_traffic VARCHAR(100),
    load_average VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL DEFAULT 'web-nodejs',
    server VARCHAR(255),
    domain VARCHAR(255),
    git VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'stopped',
    notes TEXT,
    php_version VARCHAR(50),
    node_version VARCHAR(50),
    python_version VARCHAR(50),
    framework VARCHAR(100),
    branch VARCHAR(100),
    ssl BOOLEAN DEFAULT FALSE,
    database VARCHAR(100),
    redis BOOLEAN DEFAULT FALSE,
    env TEXT,
    subdomain VARCHAR(255),
    document_root VARCHAR(255),
    composer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Databases table
CREATE TABLE IF NOT EXISTS databases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    db_type VARCHAR(100) NOT NULL DEFAULT 'PostgreSQL',
    server VARCHAR(255),
    port INT,
    status VARCHAR(50) NOT NULL DEFAULT 'stopped',
    size VARCHAR(50),
    version VARCHAR(50),
    last_backup VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Logs table
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(50) NOT NULL DEFAULT 'INFO',
    service VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    meta JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AI tables
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    content TEXT NOT NULL,
    thinking_process TEXT,
    plan JSONB,
    actions JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'idle',
    model VARCHAR(100) NOT NULL DEFAULT 'gemini-1.5-flash',
    system_prompt TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
