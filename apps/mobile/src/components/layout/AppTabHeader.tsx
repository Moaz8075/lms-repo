import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import { getInitials } from '@/utils/string';

const NAVY = '#0B1D3A';

interface AppTabHeaderProps {
  firstName: string;
  lastName: string;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function AppTabHeader({
  firstName,
  lastName,
  title = 'LegalEase',
  showBack,
  onBack,
}: AppTabHeaderProps) {
  const { typography, colors, borderRadius } = useTheme();

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable onPress={onBack} hitSlop={8} style={styles.side}>
          <Text style={{ fontSize: 22, color: colors.primary.main }}>←</Text>
        </Pressable>
      ) : (
        <View style={[styles.avatar, { backgroundColor: colors.primary.light, borderRadius: borderRadius.full }]}>
          <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
            {getInitials(firstName, lastName)}
          </Text>
        </View>
      )}

      <Text style={[typography.h3, { color: NAVY, fontWeight: '800', flex: 1, textAlign: 'center' }]}>
        {title}
      </Text>

      <View style={styles.side}>
        <Text style={{ fontSize: 20 }}>🔔</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  side: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
