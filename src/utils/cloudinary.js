// Admin-uploaded hero/testimonial images are stored as raw Cloudinary
// uploads with no resizing or compression — a 1600px-wide photo gets sent
// to a 375px-wide phone screen as-is. Cloudinary can resize/compress/
// reformat on the fly by inserting transformation params right after
// "/upload/" in the URL, with no re-upload needed. Passing anything that
// isn't a Cloudinary URL through unchanged keeps this safe to apply broadly.
export const optimizeCloudinaryUrl = (url, width) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};
