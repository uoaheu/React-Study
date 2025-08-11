import { useState } from 'react'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import UseStateHook from './hooks/UseState'
import UseEffectHook from './hooks/UseEffect'

const hooks = [
  { path: 'use-state', label: 'useState', element: <UseStateHook /> },
  { path: 'use-effect', label: 'useEffect', element: <UseEffectHook />},
  // 나머지 훅들은 나중에 추가
]

const allHooks = [
  'useState', 'useEffect', 'useCallback', 'useMemo', 'useActionState',
  'useContext', 'useDebugValue', 'useDeferredValue', 'useId', 
  'useImperativeHandle', 'useInsertionEffect', 'useLayoutEffect',
  'useOptimistic', 'useReducer', 'useRef', 'useSyncExternalStore', 'useTransition'
]

// 홈 컴포넌트
function Home() {
  // 구현된 훅들의 path 목록
  const implementedHooks = hooks.map(h => h.path)
  
  return (
    <div style={{ padding: '4px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 36, marginBottom: 16, color: '#333' }}>
        React Hooks Study
      </h1>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 40, lineHeight: 1.6 }}>
        React의 다양한 Hook들을 학습하고 연습하는 공간입니다. 
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 24 
      }}>
        {allHooks.map(hookName => {
          // useState -> use-state 변환
          const hookPath = hookName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
          const isImplemented = implementedHooks.includes(hookPath)
          
          return (
            <div
              key={hookName}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 20,
                backgroundColor: isImplemented ? '#fff' : '#f8f8f8',
                transition: 'all 0.2s ease',
                cursor: isImplemented ? 'pointer' : 'not-allowed',
                opacity: isImplemented ? 1 : 0.6
              }}
            >
              {isImplemented ? (
                <Link 
                  to={`/hooks/${hookPath}`}
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    display: 'block' 
                  }}
                >
                  <h3 style={{ 
                    fontSize: 20, 
                    marginBottom: 8, 
                    color: '#2563eb',
                    fontWeight: 600 
                  }}>
                    {hookName}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    fontSize: 14, 
                    margin: 0 
                  }}>
                    클릭하여 학습하기 →
                  </p>
                </Link>
              ) : (
                <>
                  <h3 style={{ 
                    fontSize: 20, 
                    marginBottom: 8, 
                    color: '#999',
                    fontWeight: 600 
                  }}>
                    {hookName}
                  </h3>
                  <p style={{ 
                    color: '#999', 
                    fontSize: 14, 
                    margin: 0 
                  }}>
                    준비 중...
                  </p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 개별 Hook 페이지 래퍼 (뒤로가기 버튼 포함)
function HookPageWrapper({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 20 }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none', 
            color: '#2563eb',
            fontSize: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 20, color: '#333' }}>
        {title}
      </h1>
      {children}
    </div>
  )
}

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Routes>
        {/* 홈 페이지 */}
        <Route path="/" element={<Home />} />
        
        {/* 각 Hook 페이지들 */}
        {hooks.map(hook => (
          <Route 
            key={hook.path} 
            path={`/hooks/${hook.path}`} 
            element={
              <HookPageWrapper title={hook.label}>
                {hook.element}
              </HookPageWrapper>
            } 
          />
        ))}
        
        {/* 잘못된 경로 → 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App