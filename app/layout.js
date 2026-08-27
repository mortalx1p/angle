export const metadata = {
  title: "Angle Engine — Viral Intelligence for CPA Content",
  description: "Find viral content, extract the angle, adapt it to your offer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
