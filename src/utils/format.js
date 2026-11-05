export const locale = (lng) => (lng === 'bn' ? 'bn-BD' : 'en-GB');
export const fmtDate = (d, lng) => new Date(d).toLocaleDateString(locale(lng), { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtNum = (n, lng) => Number(n).toLocaleString(locale(lng));

// Shrinks a photo in the browser so it fits in localStorage (replace with Supabase Storage later)
export function compressImage(file, maxSize = 640) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
