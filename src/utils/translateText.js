
const API_URL = 'https://api.mymemory.translated.net/get';

const translationCache = new Map();

const containsBangla = (text) => /[\u0980-\u09FF]/.test(text);

// Split long text into chunks below the API's 500-byte limit.
function splitText(text, maxBytes = 450) {
  const words = text.match(/\s+|[^\s]+/g) || [];
  const chunks = [];
  let current = '';
  let currentBytes = 0;

  for (const word of words) {
    const wordBytes = new TextEncoder().encode(word).length;

    if (currentBytes + wordBytes > maxBytes && current) {
      chunks.push(current);
      current = '';
      currentBytes = 0;
    }

    if (wordBytes > maxBytes) {
      for (const character of Array.from(word)) {
        const characterBytes = new TextEncoder().encode(character).length;

        if (currentBytes + characterBytes > maxBytes && current) {
          chunks.push(current);
          current = '';
          currentBytes = 0;
        }

        current += character;
        currentBytes += characterBytes;
      }
    } else {
      current += word;
      currentBytes += wordBytes;
    }
  }

  if (current) chunks.push(current);

  return chunks;
}

async function translateChunk(text, langPair) {
  const params = new URLSearchParams({
    q: text,
    langpair: langPair,
  });

  const response = await fetch(`${API_URL}?${params}`);
  
  if (!response.ok) {
    throw new Error('Translation request failed');
  }

  const data = await response.json();

  if (Number(data.responseStatus) !== 200) {
    throw new Error(data.responseDetails || 'Translation failed');
  }

  return data.responseData.translatedText;
}

export async function translateText(value, targetLanguage) {
  if (!value || typeof value !== 'string') return value;

  const text = value.trim();

  if (!text) return value;

  if (targetLanguage !== 'en' && targetLanguage !== 'bn') {
    return value;
  }

  const sourceLanguage = containsBangla(text) ? 'bn' : 'en';

  if (sourceLanguage === targetLanguage) {
    return value;
  }

  const cacheKey = `${sourceLanguage}:${targetLanguage}:${text}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const langPair = `${sourceLanguage}|${targetLanguage}`;

  try {
    const chunks = splitText(text);
    const translatedChunks = [];

    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, langPair));
    }

    const translatedText = translatedChunks.join('');

    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return value;
  }
}
