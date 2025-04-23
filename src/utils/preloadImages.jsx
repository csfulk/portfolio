export const preloadImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
    console.log(`Preloading image: ${url}`); // Log each image URL
  });
};