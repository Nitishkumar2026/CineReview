const placeholderImages = [
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=500&h=750&fit=crop', // Cinema seats
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop', // Film strips
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop', // Vintage projector
  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&h=750&fit=crop', // Popcorn
  'https://images.unsplash.com/photo-1627870751921-3410f0453c84?w=500&h=750&fit=crop', // Director's chair
];

export const getRandomPlaceholder = (): string => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = getRandomPlaceholder();
  e.currentTarget.onerror = null; // Prevent infinite loop if placeholder fails
};
