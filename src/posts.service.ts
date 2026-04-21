import { Injectable } from '@nestjs/common';

export interface Post {
  id: string;
  text: string;
}

export interface FindManyOptions {
  skip?: number;
  limit?: number;
  before?: string;
  after?: string;
}

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private lastPostId = 1;

  create(post: Omit<Post, 'id' | 'date'>) {
    const postWithId: Post = {
      ...post,
      id: this.lastPostId.toString(),
    };

    this.lastPostId++;

    this.posts.push(postWithId);

    return postWithId;
  }

  findMany({ skip, limit }: FindManyOptions = {}): Post[] {
  let foundPosts = this.posts;

  // Нормализация skip: отрицательные значения → 0
  const safeSkip = skip !== undefined ? Math.max(skip, 0) : 0;
  // Нормализация limit: отрицательные значения → 0, undefined → длина массива
  const safeLimit = limit !== undefined ? Math.max(limit, 0) : foundPosts.length;

  // Если limit равен 0, возвращаем пустой массив
  if (safeLimit === 0) {
    return [];
  }

  // Применяем skip и limit за один вызов slice
  return foundPosts.slice(safeSkip, safeSkip + safeLimit);
}


  find(postId: string) {
    return this.posts.find(({ id }) => id === postId);
  }

  delete(postId: string) {
    this.posts = this.posts.filter(({ id }) => id !== postId);
  }

  update(postId: string, post: Pick<Post, 'text'>) {
    const postToUpdate = this.find(postId);

    if (!postToUpdate) {
      throw new Error('Пост не найден');
    }

    Object.assign(postToUpdate, post);
  }
}