export const metadata = {
  title: "Sanity Studio - The Babcock Torch",
  description: "Content management studio for The Babcock Torch",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ margin: 0, height: "100vh", width: "100vw" }}>{children}</div>
  );
}
