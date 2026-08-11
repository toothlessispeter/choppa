# Choppa

Next.js 프론트엔드. Claude Design에서 만든 `Choppa_dc.html` 시안을 실제 동작하는
Next.js 14 + TypeScript + Tailwind CSS 프로젝트로 변환한 결과물이에요.

## 실행 방법

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인하세요.

## 구조

```
app/
  layout.tsx        전역 폰트(Instrument Sans / Spline Sans Mono), 메타데이터
  page.tsx           화면 스위처 (generate / explore / detail) + 오버레이 조립
  globals.css        베이스 스타일, range 슬라이더, 커스텀 유틸 클래스

components/
  Header.tsx          상단 네비게이션 (로고, 탭, 검색, 크레딧, Generate CTA)
  TransportBar.tsx     하단 고정 재생바
  DownloadModal.tsx    다운로드 포맷 선택 모달
  WaveformBars.tsx      목업 파형 프리뷰 (카드/미니 플레이어용)
  AudioPlayer.tsx        실제 오디오 재생용 WaveSurfer.js 플레이어
                          (백엔드가 실제 파일 URL을 반환하면 이걸로 교체)
  screens/
    GenerateScreen.tsx   프롬프트 입력 + 파라미터 모듈 + 생성/결과
    ExploreScreen.tsx    필터 사이드바 + 커뮤니티 샘플 그리드
    DetailScreen.tsx     샘플 상세 (큰 파형, 메타데이터, 관련 샘플)

lib/
  store.ts    Zustand 전역 상태 (원본 dc 파일의 Component state 포팅)
  data.ts     목업 데이터 (Key/악기/예시 프롬프트/커뮤니티 샘플 목록)
  wave.ts     시드 기반 결정론적 파형 생성기 (실제 오디오 붙기 전 프리뷰용)
  types.ts    공용 타입 정의
```

## 다음 단계 (백엔드 연동 시)

- `lib/data.ts`의 `LIBRARY_SAMPLES`, `EXAMPLE_PROMPTS`를 실제 API 응답으로 교체
- `lib/store.ts`의 `runGenerate()` 안 `setTimeout` 목업을 실제
  `POST /api/generate` 호출 + SSE/WebSocket 진행률 구독으로 교체
- 각 샘플에 실제 오디오 URL이 생기면 `WaveformBars` 대신 `AudioPlayer`
  (WaveSurfer.js 기반)로 교체해서 진짜 파형/재생을 붙이면 됨
- `DownloadModal`의 `confirmDownload`에서 실제 presigned URL 다운로드 트리거 추가
