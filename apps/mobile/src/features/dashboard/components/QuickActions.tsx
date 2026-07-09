import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onPress?: (id: string) => void;
}

export function QuickActions({ actions, onPress }: QuickActionsProps) {
  const { typography, colors, borderRadius, shadows } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={() => onPress?.(action.id)}
          style={({ pressed }) => [
            styles.item,
            {
              backgroundColor: colors.background.paper,
              borderRadius: borderRadius.lg,
              opacity: pressed ? 0.85 : 1,
              ...shadows.sm,
            },
          ]}
        >
          <View
            style={[
              styles.iconWrap,
              {
                borderColor: action.color ?? colors.primary.main,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>{action.icon}</Text>
          </View>
          <Text
            style={[
              typography.caption,
              { color: colors.text.primary, marginTop: 8, fontWeight: '600' },
            ]}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingVertical: 4,
  },
  iconWrap: {
    alignItems: 'center',
    borderWidth: 1.5,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  item: {
    alignItems: 'center',
    minWidth: 88,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
});
