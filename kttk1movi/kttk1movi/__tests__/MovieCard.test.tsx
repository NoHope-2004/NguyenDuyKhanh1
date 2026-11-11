import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovieCard, { Movie } from '../components/MovieCard';

const mockMovie: Movie = {
  id: '1',
  title: 'Inception',
  genre: 'Khoa học viễn tưởng',
  year: 2010,
  rating: 8.8,
  poster: 'https://via.placeholder.com/150',
  isShowing: true,
};

describe('MovieCard Component', () => {
  it('hiển thị đúng thông tin phim ở chế độ mặc định (row)', () => {
    const { getByText } = render(
       {}} />
    );

    expect(getByText('Inception')).toBeTruthy();
    expect(getByText('Thể loại: Khoa học viễn tưởng')).toBeTruthy();
    expect(getByText('Năm: 2010')).toBeTruthy();
    expect(getByText('Đang chiếu ✅')).toBeTruthy();
  });

  it('gọi hàm onSelect khi bấm vào thẻ phim', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      
    );

    fireEvent.press(getByText('Inception'));
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('hiển thị trạng thái ngừng chiếu chính xác', () => {
    const stoppedMovie = { ...mockMovie, isShowing: false };
    const { getByText } = render(
       {}} />
    );

    expect(getByText('Ngừng chiếu ❌')).toBeTruthy();
  });
});