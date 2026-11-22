export function formatImageUrl(url?: string | null): string {
  if (!url || !url.trim()) {
    return 'https://via.placeholder.com/300?text=Fiore+Perfumes';
  }
  const limpa = url.trim();
  if (limpa.startsWith('http://') || limpa.startsWith('https://') || limpa.startsWith('data:')) {
    return limpa;
  }
  return `http://localhost:3333${limpa.startsWith('/') ? '' : '/'}${limpa}`;
}
