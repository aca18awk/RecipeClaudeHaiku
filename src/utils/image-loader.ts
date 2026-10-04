type ImageSource = {
  uri: string;
} | number;

const imageMap: Record<string, number> = {
  'assets/images/recipes/shakshuka.jpeg': require('@/assets/images/recipes/shakshuka.jpeg'),
  'assets/images/recipes/pierogi-ruskie.jpeg': require('@/assets/images/recipes/pierogi-ruskie.jpeg'),
  'assets/images/recipes/roast-chicken.jpg': require('@/assets/images/recipes/roast-chicken.jpg'),
  'assets/images/recipes/thai-green-curry.jpeg': require('@/assets/images/recipes/thai-green-curry.jpeg'),
  'assets/images/recipes/aglio-olio.jpeg': require('@/assets/images/recipes/aglio-olio.jpeg'),
  'assets/images/recipes/teriyaki-salmon.jpeg': require('@/assets/images/recipes/teriyaki-salmon.jpeg'),
  'assets/images/recipes/chocolate-babka.jpeg': require('@/assets/images/recipes/chocolate-babka.jpeg'),
  'assets/images/recipes/red-lentil-dal.jpeg': require('@/assets/images/recipes/red-lentil-dal.jpeg'),
  'assets/images/empty-state.jpeg': require('@/assets/images/empty-state.jpeg'),
};

export function getImageSource(path: string): ImageSource {
  const source = imageMap[path];
  if (source) {
    return source;
  }
  // Fallback for any unmapped images
  return { uri: path };
}
