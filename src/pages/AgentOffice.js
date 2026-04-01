import React, { useState } from 'react';
import { Badge, Card, Spinner, EmptyState } from '../components/Common';
import { useCommits } from '../hooks/useGitHub';

const DEPTS = ['전체', '운영', '마케팅', '고객지원', '개발', '경영'];

function OnboardingGuide({ agent }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(agent?.systemPrompt || '(시스템 프롬프트 없음)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '10px 14px',
        background: '#f0f0ee', borderRadius: 8,
        fontSize: 12, color: 'var(--text-secondary)',
        cursor: 'pointer', border: 'none',
        transition: 'background 0.1s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 7v5M8 5v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <span>새 팀원 에이전트 세팅 방법</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Claude.ai Project 1회 세팅 가이드</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{open ? '∨' : '›'}</span>
      </button>

      {open && (
        <Card style={{ marginTop: 8, padding: '20px 24px' }}>
          {[
            {
              n: 1, title: 'GitHub에서 에이전트 파일 받기',
              desc: '사용할 에이전트 폴더를 통째로 다운로드하세요.',
              action: agent?.githubUrl ? (
                <a href={agent.githubUrl} target="_blank" rel="noreferrer" style={{
                  fontSize: 11, padding: '4px 10px', border: '0.5px solid var(--blue)',
                  borderRadius: 6, color: 'var(--blue)', display: 'inline-block',
                }}>GitHub에서 받기 ↗</a>
              ) : null,
            },
            {
              n: 2, title: 'Claude.ai에서 새 프로젝트 생성',
              desc: 'claude.ai/projects → + New Project → 에이전트 이름으로 생성',
              action: (
                <a href="https://claude.ai/projects" target="_blank" rel="noreferrer" style={{
                  fontSize: 11, padding: '4px 10px', border: '0.5px solid var(--blue)',
                  borderRadius: 6, color: 'var(--blue)', display: 'inline-block',
                }}>claude.ai/projects 열기 ↗</a>
              ),
            },
            {
              n: 3, title: 'md 파일 전체 지식으로 업로드',
              desc: '프로젝트 우측 Project Knowledge → + 버튼으로 md 파일을 전부 업로드하세요.',
            },
            {
              n: 4, title: '시스템 프롬프트 붙여넣기',
              desc: '아래 프롬프트를 복사해서 Custom Instructions에 붙여넣으세요.',
              action: (
                <div>
                  <button onClick={copy} style={{
                    fontSize: 11, padding: '4px 10px',
                    border: `0.5px solid ${copied ? '#1D9E75' : 'var(--border-md)'}`,
                    borderRadius: 6,
                    color: copied ? '#0F6E56' : 'var(--text-secondary)',
                    background: 'var(--surface)', marginBottom: 8,
                  }}>{copied ? '복사됨 ✓' : '프롬프트 복사'}</button>
                  <pre style={{
                    background: '#f7f7f5', borderRadius: 8, padding: '10px 12px',
                    fontSize: 11, color: 'var(--text-secondary)',
                    fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                  }}>{agent?.systemPrompt || '(meta.json에 system_prompt 필드를 추가해주세요)'}</pre>
                </div>
              ),
            },
            {
              n: 5, title: '완료',
              desc: '이후엔 문의만 붙여넣으면 돼요. 업데이트 시 바뀐 md 파일만 교체하세요.',
            },
          ].map((s, i, arr) => (
            <div key={s.n} style={{
              display: 'flex', gap: 14, padding: '14px 0',
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: '#f0f0ee', border: '0.5px solid var(--border-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'var(--text-secondary)',
              }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{s.desc}</div>
                {s.action && <div style={{ marginTop: 8 }}>{s.action}</div>}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function AgentDetail({ agent, onClose }) {
  const { commits, loading } = useCommits(agent.id);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--border)', padding: 24, width: 520, maxWidth: '90vw',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{agent.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{agent.dept} · {agent.version}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Badge status={agent.status} />
            <button onClick={onClose} style={{ fontSize: 16, color: 'var(--text-tertiary)', padding: '0 4px' }}>×</button>
          </div>
        </div>

        {[
          ['설명', agent.desc],
          ['담당자', agent.owner],
          ['스킬 파일', agent.skills.join(', ')],
          ['마지막 업데이트', agent.updated_at],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '0.5px solid var(--border)', fontSize: 12 }}>
            <span style={{ color: 'var(--text-tertiary)', width: 80, flexShrink: 0 }}>{k}</span>
            <span style={{ color: 'var(--text-primary)' }}>{v || '-'}</span>
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>최근 커밋</div>
          {loading ? <Spinner /> : commits.length === 0 ? (
            <EmptyState message="커밋 없음" />
          ) : commits.map(c => (
            <div key={c.sha} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '0.5px solid var(--border)', fontSize: 12 }}>
              <code style={{ fontSize: 10, color: 'var(--blue)', flexShrink: 0, marginTop: 1 }}>{c.sha}</code>
              <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{c.message}</span>
              <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>{c.date}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
          <button onClick={onClose} style={{ padding: '7px 14px', fontSize: 12, border: '0.5px solid var(--border-md)', borderRadius: 8, color: 'var(--text-secondary)' }}>닫기</button>
          <a href={agent.githubUrl} target="_blank" rel="noreferrer" style={{ padding: '7px 14px', fontSize: 12, border: '0.5px solid #7F77DD', borderRadius: 8, color: '#534AB7' }}>GitHub 보기 ↗</a>
        </div>
      </div>
    </div>
  );
}

export default function AgentOffice({ agents, loading }) {
  const [filter, setFilter] = useState('전체');
  const [selected, setSelected] = useState(null);

  const filtered = filter === '전체' ? agents : agents.filter(a => a.dept === filter);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {DEPTS.map(d => (
          <button key={d} onClick={() => setFilter(d)} style={{
            padding: '5px 12px', fontSize: 12, borderRadius: 20, cursor: 'pointer',
            border: '0.5px solid var(--border-md)',
            background: filter === d ? 'var(--blue)' : 'var(--surface)',
            color: filter === d ? 'white' : 'var(--text-secondary)',
          }}>{d}</button>
        ))}
      </div>

      <OnboardingGuide agent={agents[0]} />

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState message="에이전트가 없습니다. GitHub에 agents/ 폴더를 만들어주세요." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {filtered.map(a => (
            <Card key={a.id} style={{ cursor: 'pointer', transition: 'border-color 0.1s' }}
              onClick={() => setSelected(a)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{a.dept}</div>
                </div>
                <Badge status={a.status} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{a.desc || '설명 없음'}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.version} · {a.owner}</span>
                <button onClick={e => { e.stopPropagation(); setSelected(a); }} style={{
                  fontSize: 11, padding: '4px 10px',
                  border: '0.5px solid var(--blue)', borderRadius: 6, color: 'var(--blue)',
                }}>상세보기</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && <AgentDetail agent={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
