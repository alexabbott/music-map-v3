import { FilterUserLikesPipe } from './filter-user-likes.pipe';

describe('FilterUserLikesPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterUserLikesPipe();
    expect(pipe).toBeTruthy();
  });
});
