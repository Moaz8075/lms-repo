import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/providers';

interface AuthLinkProps {
  label: string;
  onPress: () => void;
}

export function AuthLink({ label, onPress }: AuthLinkProps) {
  const { colors, typography } = useTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.link}>
      <Text style={[typography.bodySmall, { color: colors.primary.main, fontWeight: '600' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'flex-start',
  },
});
