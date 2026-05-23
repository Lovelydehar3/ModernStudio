export const localImages = {
  photo01: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209749/modern-wedding-stories/images/photo-01.jpg",
  photo02: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209752/modern-wedding-stories/images/photo-02.jpg",
  photo03: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209761/modern-wedding-stories/images/photo-03.jpg",
  photo04: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209763/modern-wedding-stories/images/photo-04.jpg",
  photo05: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209765/modern-wedding-stories/images/photo-05.jpg",
  photo06: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209766/modern-wedding-stories/images/photo-06.jpg",
  photo07: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209769/modern-wedding-stories/images/photo-07.jpg",
  photo08: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209771/modern-wedding-stories/images/photo-08.jpg",
  photo09: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209774/modern-wedding-stories/images/photo-09.jpg",
  photo10: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209776/modern-wedding-stories/images/photo-10.jpg",
  photo11: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209779/modern-wedding-stories/images/photo-11.jpg",
  photo12: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209781/modern-wedding-stories/images/photo-12.jpg",
  photo13: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209783/modern-wedding-stories/images/photo-13.jpg",
  photo14: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209784/modern-wedding-stories/images/photo-14.jpg",
  photo15: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209786/modern-wedding-stories/images/photo-15.jpg",
  photo16: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209788/modern-wedding-stories/images/photo-16.jpg",
  photo17: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209789/modern-wedding-stories/images/photo-17.jpg",
  photo18: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209791/modern-wedding-stories/images/photo-18.jpg",
  photo19: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209793/modern-wedding-stories/images/photo-19.jpg"
};

export const localVideos = {
  film01: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214406/modern-wedding-stories/videos/film-01.mp4",
  film02: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214494/modern-wedding-stories/videos/film-02.mp4",
  reel01: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214517/modern-wedding-stories/videos/ref-01.mp4",
  reel02: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214540/modern-wedding-stories/videos/ref-02.mp4",
  reel03: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214562/modern-wedding-stories/videos/ref-03.mp4",
  wedding01: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779248579/modern-wedding-stories/videos/wedding-01.mp4",
  sequence01: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779248653/modern-wedding-stories/videos/sequence-01.mp4",
  song01: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779248755/modern-wedding-stories/videos/song-01.mp4"
};

export const packageThumbnails = {
  Essential: localImages.photo12,
  Premium: localImages.photo10,
  Luxury: localImages.photo01
};

export const homeGallery = [
  localImages.photo01,
  localImages.photo05,
  localImages.photo10,
  localImages.photo14
];

export const weddingGallery = [
  localImages.photo02,
  localImages.photo03,
  localImages.photo04,
  localImages.photo06,
  localImages.photo11,
  localImages.photo13
];

export const fashionGallery = [
  localImages.photo14,
  localImages.photo15,
  localImages.photo16,
  localImages.photo17,
  localImages.photo18,
  localImages.photo19
];

export const portfolioItems = [
  { category: "wedding", type: "photo", url: localImages.photo01 },
  { category: "wedding", type: "photo", url: localImages.photo03 },
  { category: "wedding", type: "photo", url: localImages.photo05 },
  { category: "wedding", type: "photo", url: localImages.photo10 },
  { category: "wedding", type: "photo", url: localImages.photo11 },
  { category: "fashion", type: "photo", url: localImages.photo14 },
  { category: "fashion", type: "photo", url: localImages.photo15 },
  { category: "fashion", type: "photo", url: localImages.photo17 },
  { category: "fashion", type: "photo", url: localImages.photo18 },
  { category: "portfolio", type: "photo", url: localImages.photo12 },
  { category: "portfolio", type: "photo", url: localImages.photo16 },
  { category: "films", type: "video", url: localImages.photo06 }
];

export const fallbackFilms = [
  {
    title: "Wedding Film | Cinematic Edit",
    summary: "Cinematic bridal portrait film with intimate detail shots and dramatic lighting.",
    videoUrl: localVideos.film02,
    coverImage: localImages.photo01
  },
  {
    title: "Wedding Highlights Reel",
    summary: "Fast-cut wedding reel crafted for social media and emotional recap storytelling.",
    videoUrl: localVideos.film01,
    coverImage: localImages.photo11
  }
];
