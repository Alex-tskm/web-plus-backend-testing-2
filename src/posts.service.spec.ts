import { PostsService } from './posts.service';

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

    beforeEach(() => {
      posts.forEach((post) => postsService.create(post));
    });

    it('should return all posts if called without options', () => {
      const result = postsService.findMany();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
      expect(result.map(post => post.text)).toEqual([
        'Post 1',
        'Post 2',
        'Post 3',
        'Post 4',
      ]);
    });

    it('should return correct posts for skip and limit options', () => {
      const result = postsService.findMany({ skip: 1, limit: 2 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 2');
      expect(result[1].text).toBe('Post 3');
    });

    it('should handle limit greater than available posts', () => {
      const result = postsService.findMany({ limit: 10 });

      expect(result).toBeDefined();
      expect(result.length).toBe(4);
      expect(result.map(post => post.text)).toEqual([
        'Post 1',
        'Post 2',
        'Post 3',
        'Post 4',
      ]);
    });

    it('should handle skip greater than available posts', () => {
      const result = postsService.findMany({ skip: 10, limit: 2 });

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle zero limit', () => {
      const result = postsService.findMany({ limit: 0 });

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle negative skip', () => {
      const result = postsService.findMany({ skip: -1, limit: 2 });

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Post 1');
      expect(result[1].text).toBe('Post 2');
    });

    it('should handle negative limit', () => {
      const result = postsService.findMany({ skip: 0, limit: -1 });

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle both skip and limit as zero', () => {
      const result = postsService.findMany({ skip: 0, limit: 0 });

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });
});
