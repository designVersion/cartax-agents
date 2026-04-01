import React, { useState } from 'react';
import { Card } from '../components/Common';

const deptData  = [['운영', 22], ['마케팅', 14], ['고객지원', 8], ['개발', 3]];
const agentData = [['이메일 에이전트', 18], ['광고 카피 에이전트', 11], ['고객 응대 에이전트', 8], ['견적 분석 에이전트', 6]];
const accounts  = [
  { name: '유세호', dept: '운영', role: '관리자', roleColor: 'var(--blue)' },
  { name: '김지현', dept: '마케팅', role: '편집자', roleColor: 'var(--green)' },
  { name: '박민준', dept: '고객지원', role: '편집자', roleColor: 'var(--green)' },
  { name: '이승우', dept: '개발', role: '뷰어', roleColor: '#888' },
  { name: '최다은', dept: '마케팅', role: '뷰어', roleColor: '#888' },
];

export function Usage() {
  const [tab, setTab] = useState('dept');
  const data = tab === 'dept' ? deptData : agentData;
  const max  = data[0][1];

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', marginBottom: 20 }}>
        {[['dept','부서별'],['agent','에이전트별']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '8px 16px', fontSize: 13, cursor: 'pointer',
            color: tab === k ? 'var(--blue)' : 'var(--text-secondary)',
            borderBottom: `2px solid ${tab === k ? 'var(--blue)' : 'transparent'}`,
            marginBottom: -1, fontWeight: tab === k ? 500 : 400,
          }}>{l}</button>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          {tab === 'dept' ? '부서별' : '에이전트별'} 호출 횟수 (이번 주)
        </div>
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

export function Admin() {
  const roleColor = { '관리자': 'var(--blue)', '편집자': 'var(--green)', '뷰어': '#888' };
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>팀원 계정 관리</div>
        {accounts.map((a, i) => (
          <div key={a.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: i < accounts.length - 1 ? '0.5px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#B5D4F4', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#0C447C',
              }}>{a.name[0]}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.dept}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: roleColor[a.role] }}>{a.role}</div>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>권한 안내</div>
        {[
          ['관리자', '에이전트 추가/수정/삭제, 배포 관리, 계정 관리'],
          ['편집자', '에이전트 수정, 버전 업데이트'],
          ['뷰어', '에이전트 조회 및 온보딩 가이드 확인'],
        ].map(([r, d]) => (
          <div key={r} style={{ display: 'flex', gap: 10, fontSize: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 500, minWidth: 50, color: roleColor[r] }}>{r}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{d}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
