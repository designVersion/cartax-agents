import { useState, useEffect } from 'react';

const GITHUB_OWNER = process.env.REACT_APP_GITHUB_OWNER || 'cartax-org';
const GITHUB_REPO  = process.env.REACT_APP_GITHUB_REPO  || 'cartax-agents';
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN || '';

const headers = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
  : {};

async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  return atob(data.content.replace(/\n/g, ''));
}

export function useAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const base = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/agents`;
        const dirs = await fetchJSON(base);
        const agentDirs = dirs.filter(d => d.type === 'dir');

        const agentList = await Promise.all(agentDirs.map(async dir => {
          try {
            const metaUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/agents/${dir.name}/meta.json`;
            const metaText = await fetchText(metaUrl);
            const meta = metaText ? JSON.parse(metaText) : {};

            const files = await fetchJSON(
              `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/agents/${dir.name}`
            );
            const mdFiles = files.filter(f => f.name.endsWith('.md')).map(f => f.name);

            return {
              id: dir.name,
              name: meta.name || dir.name,
              dept: meta.dept || '미분류',
              version: meta.version || 'v0.0.1',
              status: meta.status || 'dev',
              desc: meta.desc || '',
              owner: meta.owner || '-',
              updated_at: meta.updated_at || '',
              skills: mdFiles,
              githubUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/main/agents/${dir.name}`,
              systemPrompt: meta.system_prompt || '',
            };
          } catch {
            return null;
          }
        }));

        setAgents(agentList.filter(Boolean));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { agents, loading, error };
}

export function useCommits(agentId) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;
    async function load() {
      try {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=agents/${agentId}&per_page=5`;
        const data = await fetchJSON(url);
        setCommits(data.map(c => ({
          sha: c.sha.slice(0, 7),
          message: c.commit.message,
          author: c.commit.author.name,
          date: c.commit.author.date.slice(0, 10),
        })));
      } catch {
        setCommits([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [agentId]);

  return { commits, loading };
}
