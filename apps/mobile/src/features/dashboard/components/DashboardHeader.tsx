import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import { getInitials } from '@/utils/string';

const NAVY = '#0B1D3A';

interface DashboardHeaderProps {
  appName: string;
  greeting: string;
  dateLabel: string;
  locationLabel?: string | null;
  firstName: string;
  lastName: string;
  onNotificationsPress?: () => void;
}

export function DashboardHeader({
  appName,
  greeting,
  dateLabel,
  locationLabel,
  firstName,
  lastName,
  onNotificationsPress,
}: DashboardHeaderProps) {
  const { typography, colors, borderRadius } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.topBar}>
        <View style={[styles.avatar, { backgroundColor: colors.primary.light, borderRadius: borderRadius.full }]}>
          <Text style={[typography.label, { color: colors.primary.dark, fontWeight: '700' }]}>
            {getInitials(firstName, lastName)}
          </Text>
        </View>

        <Text style={[typography.h3, { color: NAVY, fontWeight: '800' }]}>{appName}</Text>

        <Pressable onPress={onNotificationsPress} hitSlop={8} style={styles.bell}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </Pressable>
      </View>

      <Text style={[typography.h2, { color: colors.text.primary, marginTop: 20 }]}>{greeting}</Text>
      <Text style={[typography.caption, { color: colors.text.secondary, marginTop: 6, letterSpacing: 0.5 }]}>
        {dateLabel}
        {locationLabel ? ` • ${locationLabel.toUpperCase()}` : ''}
      </Text>
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
  bell: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrap: {
    marginBottom: 20,
  },
});
