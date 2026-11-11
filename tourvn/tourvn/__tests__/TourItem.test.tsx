import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TourItem from '../components/TourItem';
import { Tour } from '../utils/tour';

const mockTour: Tour = {
  id: '1',
  name: 'Đà Lạt mộng mơ',
  city: 'Đà Lạt',
  days: 3,
  price: 3590000,
  seats: 2,
  departure: '2026-11-05',
  image: 'https://via.placeholder.com/150',
  isFavorite: false,
};

describe('TourItem Component Tests', () => {
  test('compact = true does not display city', () => {
    const { queryByText } = render(
      <TourItem tour={mockTour} compact={true} onPress={() => {}} onToggleFavorite={() => {}} />
    );
    expect(queryByText('Đà Lạt')).toBeNull();
  });

  test('compact = false displays city and full info', () => {
    const { getByText } = render(
      <TourItem tour={mockTour} compact={false} onPress={() => {}} onToggleFavorite={() => {}} />
    );
    expect(getByText('Đà Lạt')).toBeTruthy();
  });

  test('pressing fav-btn calls onToggleFavorite and does not trigger onPress', () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByTestId } = render(
      <TourItem tour={mockTour} compact={false} onPress={onPress} onToggleFavorite={onToggleFavorite} />
    );

    fireEvent.press(getByTestId('fav-btn'));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith('1', true);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('pressing tour body calls onPress with tour object', () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByText } = render(
      <TourItem tour={mockTour} compact={false} onPress={onPress} onToggleFavorite={onToggleFavorite} />
    );

    fireEvent.press(getByText('Đà Lạt mộng mơ'));
    expect(onPress).toHaveBeenCalledWith(mockTour);
  });
});