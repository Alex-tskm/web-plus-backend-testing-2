import { PostsService, Post, FindManyOptions } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(() => {
    postsService = new PostsService();
  });

  describe('.findMany', () => {
    const posts = [
      { text: 'Post 1' },
      { text: 'Post 2' },
      { text: 'Post 3' },
      { text: 'Post 4' },
    ];

    const createdPosts: Post[] = [];

    beforeEach(() => {
      createdPosts.length = 0;
      posts.forEach((post) => {
        const createdPost = postsService.create(post);
        createdPosts.push(createdPost);
      });
    });

    it('should cover the basic functionality of findMany method', () => {
      const result = postsService.findMany();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
      expect(result.map(post => post.text)).toEqual([
        'Post 1', 'Post 2', 'Post 3', 'Post 4'
      ]);
    });

    it('should handle skip parameter with positive value (mutant ID 3,4,5)', () => {
      const result = postsService.findMany({ skip: 2 });
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 3');
      expect(result[1].text).toBe('Post 4');
    });

    it('should handle skip parameter with zero value (mutant ID 3,4,5)', () => {
      const result = postsService.findMany({ skip: 0 });
      expect(result).toBeDefined();
      expect(result.length).toBe(4);
      expect(result[0].text).toBe('Post 1');
    });

    it('should handle skip parameter with negative value (mutant ID 3,4,5)', () => {
      const result = postsService.findMany({ skip: -1 });
      expect(result).toBeDefined();
      expect(result.length).toBe(4);
      expect(result[0].text).toBe('Post 1');
    });

    it('should handle skip parameter greater than array length (mutant ID 3,4,5)', () => {
      const result = postsService.findMany({ skip: 10 });
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle limit parameter with positive value (mutant ID 8,9,10)', () => {
      const result = postsService.findMany({ limit: 2 });
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 1');
      expect(result[1].text).toBe('Post 2');
    });

    it('should handle limit parameter with zero value (mutant ID 8,9,10)', () => {
      const result = postsService.findMany({ limit: 0 });
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle limit parameter with negative value (mutant ID 8,9,10)', () => {
      const result = postsService.findMany({ limit: -1 });
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle limit parameter greater than available posts (mutant ID 8,9,10)', () => {
      const result = postsService.findMany({ limit: 10 });
      expect(result).toBeDefined();
      expect(result.length).toBe(4);
    });

    it('should return all posts when limit equals array length and skip is 0 (mutant ID 7)', () => {
      const result = postsService.findMany({ skip: 0, limit: 4 });
      expect(result).toBeDefined();
      expect(result.length).toBe(4);
      expect(result[0].text).toBe('Post 1');
      expect(result[3].text).toBe('Post 4');
    });

    it('should return correct subset when skip > 0 and limit equals remaining posts (mutant ID 7)', () => {
      const result = postsService.findMany({ skip: 2, limit: 2 });
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 3');
      expect(result[1].text).toBe('Post 4');
    });

    it('should handle skip equal to array length with limit (mutant ID 7)', () => {
      const result = postsService.findMany({ skip: 4, limit: 2 });
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle both skip and limit parameters with positive values', () => {
      const result = postsService.findMany({ skip: 1, limit: 2 });
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 2');
      expect(result[1].text).toBe('Post 3');
    });

    it('should handle negative skip and positive limit', () => {
      const result = postsService.findMany({ skip: -2, limit: 3 });
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].text).toBe('Post 1');
    });

    it('should handle positive skip and negative limit', () => {
      const result = postsService.findMany({ skip: 1, limit: -1 });
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle zero skip and positive limit', () => {
      const result = postsService.findMany({ skip: 0, limit: 2 });
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 1');
    });

    it('should handle positive skip and zero limit', () => {
      const result = postsService.findMany({ skip: 2, limit: 0 });
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should return empty array when skip is greater than or equal to array length', () => {
      const result = postsService.findMany({ skip: 4 });
      expect(result).toEqual([]);
    });

    it('should handle NaN values for skip and limit gracefully', () => {
      const result1 = postsService.findMany({ skip: NaN as any });
      const result2 = postsService.findMany({ limit: NaN as any });

      expect(result1.length).toBe(4); // skip: NaN → 0 → все посты
      expect(result2.length).toBe(0); // limit: NaN → 0 → пустой массив
    });

    it('should return empty array when both skip and limit are zero', () => {
      const result = postsService.findMany({ skip: 0, limit: 0 });
      expect(result).toEqual([]);
    });

    it('should return correct subset when skip + limit exceeds array length', () => {
      const result = postsService.findMany({ skip: 2, limit: 10 });
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 3');
      expect(result[1].text).toBe('Post 4');
    });

    it('should handle both skip and limit as NaN', () => {
      const result = postsService.findMany({ skip: NaN as any, limit: NaN as any });
      expect(result.length).toBe(0); // оба параметра → 0 → пустой массив
    });

    // ИСПРАВЛЕННЫЙ ТЕСТ: убрана проверка text, так как массив пуст
    it('should handle positive skip and limit as NaN', () => {
      const result = postsService.findMany({ skip: 1, limit: NaN as any });
      expect(result.length).toBe(0); // limit: NaN → 0 → пустой массив
    });
  });

  describe('.create', () => {
    it('should create a new post with correct ID', () => {
      const post = { text: 'New Post' };
      const result = postsService.create(post);

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.text).toBe('New Post');
    });

    it('should increment ID for subsequent posts', () => {
      const post1 = { text: 'First Post' };
      const post2 = { text: 'Second Post' };

      const result1 = postsService.create(post1);
      const result2 = postsService.create(post2);

      expect(result1.id).toBe('1');
      expect(result2.id).toBe('2');
    });
  });

  describe('.find', () => {
    beforeEach(() => {
      postsService.create({ text: 'Existing Post' });
    });

    it('should find existing post by ID', () => {
      const result = postsService.find('1');
      expect(result).toBeDefined();
      expect(result!.text).toBe('Existing Post');
    });

    it('should return undefined for non-existing post', () => {
      const result = postsService.find('999');
      expect(result).toBeUndefined();
    });

    it('should correctly find post after multiple creations', () => {
      postsService.create({ text: 'Another Post' });
      const result = postsService.find('2');
      expect(result).toBeDefined();
      expect(result!.text).toBe('Another Post');
    });
  });

  describe('.delete', () => {
    beforeEach(() => {
      postsService.create({ text: 'To Be Deleted' });
    });

    it('should delete post by ID', () => {
      postsService.delete('1');
      const result = postsService.find('1');
      expect(result).toBeUndefined();
    });

    it('should not affect other posts when deleting one', () => {
      postsService.create({ text: 'Post to Keep' });
      postsService.delete('1');

      const keptPost = postsService.find('2');
      expect(keptPost).toBeDefined();
      expect(keptPost!.text).toBe('Post to Keep');
    });

    it('should handle deletion of non-existing post gracefully', () => {
      const initialLength = postsService.findMany().length;
      postsService.delete('999');
      const finalLength = postsService.findMany().length;
      expect(finalLength).toBe(initialLength);
    });
  });

  describe('.update', () => {
    beforeEach(() => {
      postsService.create({ text: 'Original Text' });
    });

    it('should update post text', () => {
      postsService.update('1', { text: 'Updated Text' });
      const updatedPost = postsService.find('1');
      expect(updatedPost).toBeDefined();
      expect(updatedPost!.text).toBe('Updated Text');
    });

    it('should throw error when updating non-existing post', () => {
      expect(() => {
        postsService.update('999', { text: 'Non-existent' });
      }).toThrow('Пост не найден');
    });

    it('should allow updating multiple times', () => {
      postsService.update('1', { text: 'First Update' });
      postsService.update('1', { text: 'Second Update' });

      const updatedPost = postsService.find('1');
      expect(updatedPost).toBeDefined();
      expect(updatedPost!.text).toBe('Second Update');
    });

    it('should preserve other properties when updating', () => {
      const originalPost = postsService.find('1')!;
      const originalId = originalPost.id;

      postsService.update('1', { text: 'Modified Text' });
      const updatedPost = postsService.find('1')!;

      expect(updatedPost.id).toBe(originalId);
      expect(updatedPost.text).toBe('Modified Text');
    });
  });
});
