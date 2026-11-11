export interface Tour {
  id: string;
  name: string;
  city: string;
  departure: string;
  days: number;
  price: number;
  isFavorite?: boolean;
}

// Thêm hàm getSeatLabel để TourItem sử dụng hiển thị thông tin số ngày/chỗ ngồi
export function getSeatLabel(tour: Tour): string {
  return `${tour.days} ngày`;
}

// Hàm gom nhóm các tour theo thành phố cho SectionList
export function groupByCity(tours: Tour[]) {
  if (!Array.isArray(tours)) {
    return [];
  }

  const groups: { [key: string]: Tour[] } = {};

  tours.forEach((tour) => {
    const city = tour.city || 'Khác';
    if (!groups[city]) {
      groups[city] = [];
    }
    groups[city].push(tour);
  });

  return Object.keys(groups).map((city) => ({
    title: city,
    data: groups[city],
  }));
}