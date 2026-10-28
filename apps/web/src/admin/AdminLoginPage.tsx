import { useState } from 'react';
import { adminApi, setAdminToken } from '../api/admin';

type Status = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

export function AdminLoginPage() {
  const [mode, setMode] = useState<'token' | 'password'>('token');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });

  async function login() {
    setStatus({ type: 'loading', message: 'Đang đăng nhập...' });
    try {
      const res = await adminApi.login(mode === 'token' ? { token } : { username, password });
      setAdminToken(res.token);
      setStatus({ type: 'success', message: 'Đăng nhập thành công' });
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Không đăng nhập được' });
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <span className="eyebrow">HopGiayRe Admin</span>
        <h1>Đăng nhập quản trị</h1>
        <p className="muted">Dùng token nhanh hoặc username/password trong file <code>apps/api/.env</code>.</p>
        <div className="ai-tabs">
          <button className={mode === 'token' ? 'active' : ''} onClick={() => setMode('token')}>Token</button>
          <button className={mode === 'password' ? 'active' : ''} onClick={() => setMode('password')}>Mật khẩu</button>
        </div>
        {mode === 'token' ? (
          <label>ADMIN_API_TOKEN<input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Dán ADMIN_API_TOKEN" /></label>
        ) : (
          <>
            <label>Tài khoản<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
            <label>Mật khẩu<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          </>
        )}
        {status.message ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}
        <button className="primary-btn" onClick={login} disabled={status.type === 'loading'}>Đăng nhập</button>
      </section>
    </main>
  );
}
