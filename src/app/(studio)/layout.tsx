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
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
