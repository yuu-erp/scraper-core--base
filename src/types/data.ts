export interface SourceEpisode {
  name: string;
  sourceEpisodeId: string;
  sourceMediaId: string;
}
export interface SourceAnime {
  titles: string[];
  episodes: SourceEpisode[];
  sourceId: string;
  sourceMediaId: string;
  anilistId?: number;
}
export interface SourceChapter {
  name: string;
  sourceChapterId: string;
  sourceMediaId: string;
}
export interface SourceManga {
  titles: string[];
  chapters: SourceChapter[];
  sourceId: string;
  sourceMediaId: string;
  anilistId?: number;
}
