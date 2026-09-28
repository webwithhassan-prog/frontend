// Accepts any common YouTube link shape — watch?v=, youtu.be/, embed/,
// shorts/, with or without extra params — or a bare 11-char video id.
export const getYoutubeId = (link) => {
  if (!link) return null;
  const match = link.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (match) return match[1];
  return /^[\w-]{11}$/.test(link.trim()) ? link.trim() : null;
};
