# 최초 최고관리자 계정 생성 방법

Firebase Authentication에서 직접 계정을 만들고
Firestore에 유저 문서를 추가해야 해요.

## 방법 1 — Firebase 콘솔에서 직접 생성 (추천)

### 1. Authentication에서 계정 생성
1. console.firebase.google.com → cartax-agents 프로젝트
2. Authentication → Users → Add user
3. Email: 세호님 이메일 입력
4. Password: 임시 비밀번호 입력
5. Add user 클릭
6. 생성된 User UID 복사 (중요)

### 2. Firestore에 유저 문서 생성
1. Firestore Database → 데이터 탭
2. + 컬렉션 시작 → 컬렉션 ID: users
3. 문서 ID: 위에서 복사한 UID 붙여넣기
4. 아래 필드 추가:

| 필드명 | 타입 | 값 |
|---|---|---|
| username | string | seho (또는 원하는 아이디) |
| name | string | 유세호 |
| email | string | 세호님 이메일 |
| dept | string | 운영 |
| role | number | 4 |
| status | string | active |
| loginFailCount | number | 0 |
| createdAt | timestamp | (현재 시간 선택) |

5. 저장

### 3. 웹앱에서 로그인
이메일 + 임시 비밀번호로 로그인 후
내 계정 → 비밀번호 변경으로 변경

## 방법 2 — Firestore 보안 규칙 설정

아래 보안 규칙을 Firestore Rules에 적용해주세요:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 로그인한 사용자만 본인 정보 읽기 가능
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 4;
    }
    
    // 로그인한 사용자만 읽기, 최고관리자만 쓰기
    match /departments/{deptId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 4;
    }
    
    // 최고관리자만 접근
    match /allowedIPs/{ipId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 4;
    }
    
    // 로그인한 사용자 로그 쓰기 가능, 최고관리자만 읽기
    match /logs/{logId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 4;
    }
    
    // 에이전트 메타 - 로그인한 사용자 읽기, 편집자 이상 쓰기
    match /agents/{agentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role >= 3;
    }
  }
}
```
