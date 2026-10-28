export function LoadingBlock() {
  return <div className="state-block">Đang tải dữ liệu...</div>;
}

export function ErrorBlock({ message }: { message: string }) {
  return <div className="state-block error">Không tải được dữ liệu: {message}</div>;
}
