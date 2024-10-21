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

export type Chapter = {
  name: string;
  sourceId: string;
  sourceChapterId: string;
  sourceMediaId: string;
  slug: string;
  sourceConnectionId: string;
};

export interface SourceMediaConnection {
  id: string;
  mediaId: number;
  sourceMediaId: string;
  sourceId: string;
}

export interface Manga {
  anilistId: number;
  chapters: Chapter[];
  sourceMangaConnection: SourceMediaConnection;
}
