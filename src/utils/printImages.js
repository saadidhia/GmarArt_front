const API_BASE = process.env.REACT_APP_API?.replace(/\/+$/, '');

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('/uploads')) {
    return `${API_BASE}${imageUrl}`;
  }
  if (!imageUrl.startsWith('/')) {
    return `${API_BASE}/uploads/prints/${imageUrl}`;
  }
  return `${API_BASE}${imageUrl}`;
};

export const getAllImageUrls = (print) => {
  const urls = [];
  for (let i = 1; i <= 5; i++) {
    const urlKey = `imageUrl${i}`;
    if (print[urlKey]) {
      urls.push(getImageUrl(print[urlKey]));
    }
  }
  return urls;
};

export const cmToIn = (cm) => (cm * 0.393701).toFixed(1);
