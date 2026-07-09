import { View } from 'react-native';

import { PlaceholderTabScreen } from '@/components/layout/PlaceholderTabScreen';
import { AuthButton, useLogout } from '@/features/auth';
import { useTheme } from '@/providers';

export default function MoreTabScreen() {
  const logoutMutation = useLogout();
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <PlaceholderTabScreen title="More" subtitle="Settings and additional modules." />
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] }}>
        <AuthButton
          label="Sign out"
          variant="secondary"
          loading={logoutMutation.isPending}
          onPress={() => logoutMutation.mutate()}
        />
      </View>
    </View>
  );
}
