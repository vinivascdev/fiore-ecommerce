import { API_URL } from '../config/api';

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400' fill='none'><rect width='400' height='400' fill='%23FDF8FB'/><circle cx='200' cy='165' r='60' fill='%23FFB6E6' fill-opacity='0.35'/><g fill='%23DD0088'><rect x='186' y='116' width='28' height='16' rx='3'/><rect x='194' y='132' width='12' height='10'/><rect x='160' y='142' width='80' height='88' rx='16'/><circle cx='200' cy='186' r='14' fill='%23FDF8FB' fill-opacity='0.45'/></g><text x='200' y='268' font-family='system-ui, -apple-system, sans-serif' font-size='20' font-weight='700' fill='%23DD0088' text-anchor='middle' letter-spacing='0.5'>Fiore Perfumes</text><text x='200' y='292' font-family='system-ui, -apple-system, sans-serif' font-size='12' font-weight='500' fill='%23A8A29E' text-anchor='middle'>Sem imagem disponível</text></svg>`;

export function formatImageUrl(url?: string | null): string {
  if (!url || !url.trim()) {
    return PLACEHOLDER_SVG;
  }
  const limpa = url.trim();
  if (limpa.startsWith('http://') || limpa.startsWith('https://') || limpa.startsWith('data:')) {
    return limpa;
  }
  return `${API_URL}${limpa.startsWith('/') ? '' : '/'}${limpa}`;
}
