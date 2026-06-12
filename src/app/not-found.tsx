import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page" style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ fontSize: 80, marginBottom: 16, lineHeight: 1 }}>404</div>
      <div className="gold-line" style={{ marginBottom: 32 }} />
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>页面未找到</h1>
      <p className="body" style={{ marginBottom: 32 }}>
        墨迹未干，此页尚不存在。<br />不如回到首页，重新探索智能体宇宙。
      </p>
      <Link href="/" className="btn btn-red">返回首页</Link>
    </div>
  );
}
