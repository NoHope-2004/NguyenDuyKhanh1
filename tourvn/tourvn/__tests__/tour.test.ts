import { formatDate, getSeatLabel, groupByCity, Tour } from '../utils/tour';

describe('Tour Utils Tests', () => {
  test('formatDate should format correctly', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });

  test('getSeatLabel boundary values', () => {
    expect(getSeatLabel(0)).toBe('Hết chỗ');
    expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
    expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
  });

  test('groupByCity sorting and grouping', () => {
    const mockTours: Tour[] = [
      { id: '1', name: 'Tour B', city: 'Đà Lạt', days: 3, price: 1000, seats: 5, departure: '2026-11-02', image: '', isFavorite: false },
      { id: '2', name: 'Tour A', city: 'Đà Lạt', days: 2, price: 1000, seats: 5, departure: '2026-11-01', image: '', isFavorite: false },
      { id: '3', name: 'Tour C', city: 'An Giang', days: 2, price: 1000, seats: 5, departure: '2026-11-01', image: '', isFavorite: false },
    ];

    const result = groupByCity(mockTours);
    expect(result.length).toBe(2);
    expect(result[0].title).toContain('An Giang');
    expect(result[1].title).toContain('Đà Lạt');
    // Kiểm tra sắp xếp ngày trong Đà Lạt
    expect(result[1].data[0].departure).toBe('2026-11-01');
    expect(result[1].data[1].departure).toBe('2026-11-02');
  });
});