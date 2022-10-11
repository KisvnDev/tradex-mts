import React from 'react';
import { ActivityIndicator } from 'react-native';
import { FallbackProps } from 'react-error-boundary';

export default ({ componentStack, error }: FallbackProps) => {
  return <ActivityIndicator />;
};
