import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useIPCheck() {
  const [allowed, setAllowed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const { ip } = await res.json();

        const snap = await getDocs(collection(db, 'allowedIPs'));
        const ips = snap.docs.map(d => d.data().ip);

        if (ips.length === 0) {
          setAllowed(true);
        } else {
          setAllowed(ips.includes(ip));
        }
      } catch {
        setAllowed(true);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  return { allowed, loading };
}

export function useGitHubAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const owner = process.env.REACT_APP_GITHUB_OWNER;
        const repo = process.env.REACT_APP_GITHUB_REPO;
        const token = process.env.REACT_APP_GITHUB_TOKEN;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/agents`, { headers });
        if (!res.ok) throw new Error();
        const dirs = await res.json();

        const list = await Promise.all(
          dirs.filter(d => d.type === 'dir').map(async dir => {
            try {
              const metaRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/agents/${dir.name}/meta.json`,
                { headers }
              );
              if (!metaRes.ok) return null;
              const metaData = await metaRes.json();
              const meta = JSON.parse(atob(metaData.content.replace(/\n/g, '')));
              return { id: dir.name, ...meta };
            } catch { return null; }
          })
        );
        setAgents(list.filter(Boolean));
      } catch {
        setAgents([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { agents, loading };
}
