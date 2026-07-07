export const metadata = {
  title: 'DevRadar AI',
  description: 'Compare habilidades com vagas e gere um plano de evolução.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
