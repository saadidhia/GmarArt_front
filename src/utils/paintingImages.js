const API_BASE = 'http://localhost:8081';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('/uploads')) {
    return `${API_BASE}${imageUrl}`;
  }
  if (!imageUrl.startsWith('/')) {
    return `${API_BASE}/uploads/paintings/${imageUrl}`;
  }
  return `${API_BASE}${imageUrl}`;
};

export const getAllImageUrls = (painting) => {
  const urls = [];
  for (let i = 1; i <= 7; i++) {
    const urlKey = `imageUrl${i}`;
    if (painting[urlKey]) {
      urls.push(getImageUrl(painting[urlKey]));
    }
  }
  return urls;
};

export const cmToIn = (cm) => (cm * 0.393701).toFixed(1);
