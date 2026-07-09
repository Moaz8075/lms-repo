import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface AccordionSectionProps {
  title: string;
  icon: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({
  title,
  icon,
  badge,
  defaultOpen = false,
  children,
}: AccordionSectionProps) {
  const { typography, colors, borderRadius, spacing } = useTheme();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          marginBottom: spacing.sm,
        },
      ]}
    >
      <Pressable onPress={() => setOpen((value) => !value)} style={styles.header}>
        <Text style={{ fontSize: 18, marginRight: 12 }}>{icon}</Text>
        <Text style={[typography.body, { fontWeight: '700', flex: 1 }]}>
          {title}
          {badge ? ` (${badge})` : ''}
        </Text>
        <Text style={{ color: colors.text.secondary }}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  wrap: {
    overflow: 'hidden',
  },
});
