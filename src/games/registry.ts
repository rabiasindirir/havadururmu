export type GameId =
  | 'sudoku'
  | 'memory'
  | 'coloring'
  | 'puzzle'
  | 'tictactoe'
  | 'sequence'
  | 'wordsearch'
  | 'maze'
  | 'oddout'
  | 'mathquiz';

export interface GameMeta {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  emoji: string;
}

export const games: GameMeta[] = [
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Sayıları yerleştir',
    icon: 'Grid3x3',
    gradient: 'from-amber-400 to-orange-500',
    emoji: '🔢',
  },
  {
    id: 'memory',
    title: 'Hafıza Kartları',
    description: 'Eşleri bul',
    icon: 'LayoutGrid',
    gradient: 'from-pink-400 to-rose-500',
    emoji: '🃏',
  },
  {
    id: 'coloring',
    title: 'Boyama',
    description: 'Resimleri boya',
    icon: 'Palette',
    gradient: 'from-violet-400 to-purple-500',
    emoji: '🎨',
  },
  {
    id: 'puzzle',
    title: 'Kaydırma Yapbozu',
    description: 'Parçaları sırala',
    icon: 'Puzzle',
    gradient: 'from-cyan-400 to-blue-500',
    emoji: '🧩',
  },
  {
    id: 'tictactoe',
    title: 'XOX Oyunu',
    description: 'Üç tane yap',
    icon: 'Hash',
    gradient: 'from-emerald-400 to-green-500',
    emoji: '⭕',
  },
  {
    id: 'sequence',
    title: 'Sayı Sıralama',
    description: 'Boşluğu doldur',
    icon: 'ArrowRightCircle',
    gradient: 'from-teal-400 to-cyan-500',
    emoji: '📈',
  },
  {
    id: 'wordsearch',
    title: 'Kelime Bulma',
    description: 'Kelimeleri yakala',
    icon: 'Search',
    gradient: 'from-indigo-400 to-blue-600',
    emoji: '🔍',
  },
  {
    id: 'maze',
    title: 'Labirent',
    description: 'Çıkışı bul',
    icon: 'Navigation',
    gradient: 'from-lime-400 to-green-500',
    emoji: '🌀',
  },
  {
    id: 'oddout',
    title: 'Farklı Olanı Bul',
    description: 'Hangisi farklı?',
    icon: 'Diff',
    gradient: 'from-fuchsia-400 to-pink-500',
    emoji: '🤔',
  },
  {
    id: 'mathquiz',
    title: 'Matematik Bulmaca',
    description: 'Hesapla, kazan',
    icon: 'Calculator',
    gradient: 'from-red-400 to-orange-500',
    emoji: '➕',
  },
];
