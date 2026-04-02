import React from 'react';
import { Card, StatCard } from '../components/Common';

const depts = [
  { label: '운영', count: 4, color: '#378ADD', pct: 80 },
  { label: '마케팅', count: 3, color: '#1D9E75', pct: 60 },
  { label: '고객지원', count: 2, color: '#7F77DD', pct: 40 },
  { label: '개발', count: 2, color: '#D85A30', pct: 40 },
  { label: '경영', count: 1, color: '#888780', pct: 20 },
];

export default function Dashboard({ agents }) {
  const stable = agents.filter(a => a.status === 'stable').length;
  const notStable = agents.length - stable;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="전체 에이전트" value={agents.length || 0} delta="GitHub 연동" />
        <StatCard label="운영 중" value={stable} delta="stable" />
        <StatCard label="베타 / 개발 중" value={notStable} delta="검토 필요" deltaColor="var(--amber)" />
        <StatCard label="전체 팀원" value={10} delta="카택스" deltaColor="var(--text-tertiary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>부서별 에이전트 수</div>
          {depts.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 60, textAlign: 'right' }}>{d.label}</div>
              <div style={{ flex: 1, height: 8, background: '#f0f0ee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 16 }}>{d.count}</div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>최근 업데이트</div>
          {agents.slice(0, 3).map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f7f7f5', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.status === 'stable' ? '#1D9E75' : a.status === 'beta' ? '#EF9F27' : '#aaa' }} />
                <div>
                  <div style={{ fontSize: 13 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.dept} · {a.version}</div>
                </div>
              </div>
            </div>
          ))}
          {agents.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: 20 }}>에이전트가 없습니다</div>}
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>이번 주 활동</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[{ value: '0', label: '총 호출' }, { value: '0', label: '활성 사용자' }, { value: '-', label: '최다 사용 에이전트' }, { value: '100%', label: '가동률', color: 'var(--green)' }].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 500, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: '0.5px', background: 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}
