import React, { useState } from 'react';
import { Card } from '../components/Common';

const deptData  = [['운영', 22], ['마케팅', 14], ['고객지원', 8], ['개발', 3]];
const agentData = [['이메일 에이전트', 18], ['광고 카피 에이전트', 11], ['고객 응대 에이전트', 8], ['견적 분석 에이전트', 6]];

export default function Usage() {
  const [tab, setTab] = useState('dept');
  const data = tab === 'dept' ? deptData : agentData;
  const max = data[0][1];

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', marginBottom: 20 }}>
        {[['dept','부서별'],['agent','에이전트별']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '8px 16px', fontSize: 13, color: tab === k ? 'var(--blue)' : 'var(--text-secondary)', borderBottom: `2px solid ${tab === k ? 'var(--blue)' : 'transparent'}`, marginBottom: -1, fontWeight: tab === k ? 500 : 400 }}>
            {l}
          </button>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>{tab === 'dept' ? '부서별' : '에이전트별'} 호출 횟수 (이번 주)</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 16, padding: '8px 12px', background: '#f0f0ee', borderRadius: 8 }}>
          사용량 트래킹은 에이전트 호출 로그 연동 후 활성화됩니다. 현재는 샘플 데이터입니다.
        </div>
        {data.map(([n, v]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: tab === 'dept' ? 72 : 140, flexShrink: 0 }}>{n}</div>
            <div style={{ flex: 1, height: 10, background: '#f0f0ee', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round(v / max * 100)}%`, height: '100%', background: '#378ADD', borderRadius: 5 }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 40, textAlign: 'right' }}>{v}회</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
