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
        <StatCard label="전체 에이전트" value={agents.length || 12} delta="+2 이번 달" />
        <StatCard label="운영 중" value={stable || 8} delta="stable" />
        <StatCard label="베타 / 개발 중" value={notStable || 4} delta="검토 필요" deltaColor="var(--amber)" />
        <StatCard label="전체 팀원" value={10} delta="카택스" deltaColor="var(--text-tertiary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>부서별 에이전트 수</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {depts.map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 60, textAlign: 'right' }}>{d.label}</div>
                <div style={{ flex: 1, height: 8, background: '#f0f0ee', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 16 }}>{d.count}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>최근 업데이트</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(agents.length ? agents.slice(0, 3) : [
              { name: '이메일 에이전트', dept: '운영', version: 'v1.2.0', status: 'stable', updated_at: '3일 전' },
              { name: '견적 분석 에이전트', dept: '마케팅', version: 'v0.3.1', status: 'beta', updated_at: '1주 전' },
              { name: '리포트 생성 에이전트', dept: '경영', version: 'v0.1.0', status: 'dev', updated_at: '2주 전' },
            ]).map(a => (
              <div key={a.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', background: '#f7f7f5', borderRadius: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: a.status === 'stable' ? '#1D9E75' : a.status === 'beta' ? '#EF9F27' : '#aaa',
                  }} />
                  <div>
                    <div style={{ fontSize: 13 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.dept} · {a.version}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 10, fontWeight: 500,
                  background: a.status === 'stable' ? 'var(--green-light)' : a.status === 'beta' ? 'var(--amber-light)' : '#f0f0ee',
                  color: a.status === 'stable' ? 'var(--green)' : a.status === 'beta' ? 'var(--amber)' : '#888',
                }}>{a.status === 'stable' ? 'stable' : a.status === 'beta' ? 'beta' : '개발중'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>이번 주 활동</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { value: '47', label: '총 호출' },
            { value: '8', label: '활성 사용자' },
            { value: '이메일', label: '최다 사용 에이전트' },
            { value: '100%', label: '가동률', color: 'var(--green)' },
          ].map((s, i, arr) => (
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
