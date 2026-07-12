import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { useDailyDiary, useUpdateHearing } from '@/features/diary/hooks/useDiary';
import { diaryRoutes } from '@/features/diary/routes';
import {
  formatHearingClock,
  toLocalDateString,
} from '@/features/diary/utils/diary-format';
import { useAuthContext, useTheme } from '@/providers';
import type { DiaryCaseRow } from '@/types';

export default function DiaryWrapUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();
  const today = toLocalDateString();
  const { data, isLoading, refetch, isRefetching } = useDailyDiary(today);
  const updateHearing = useUpdateHearing();

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const rows = data?.caseRows ?? [];
  const loggedCount = Object.values(completed).filter(Boolean).length;

  const handleSave = async (row: DiaryCaseRow) => {
    const summary = (drafts[row.hearingId] ?? '').trim();
    if (!summary) return;

    setSavingId(row.hearingId);
    try {
      await updateHearing.mutateAsync({
        id: row.hearingId,
        payload: { notes: summary },
      });
      setCompleted((prev) => ({ ...prev, [row.hearingId]: true }));
    } finally {
      setSavingId(null);
    }
  };

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 40,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="End-of-Day"
          showBack
          onBack={() => router.back()}
        />

        <View style={[styles.badge, { backgroundColor: colors.primary.light }]}>
          <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
            Daily Wrap-up
          </Text>
        </View>
        <Text style={[typography.h2, { marginTop: 8 }]}>End-of-Day Assistant</Text>
        <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 6 }]}>
          You attended {rows.length} hearing{rows.length === 1 ? '' : 's'} today. Log outcomes and
          schedule next dates.
        </Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} style={{ marginTop: 24 }} /> : null}

        {rows.map((row) => {
          const isDone = !!completed[row.hearingId];

          return (
            <View
              key={row.hearingId}
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.paper,
                  borderRadius: borderRadius.lg,
                  borderColor: colors.border.default,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.caseTag, { backgroundColor: colors.primary.light }]}>
                  <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
                    Case #{row.caseNumber}
                  </Text>
                </View>
                <Text style={[typography.caption, { color: colors.text.secondary }]}>
                  🕒 {formatHearingClock(row.hearingTime)}
                </Text>
              </View>

              <Text style={[typography.body, { fontWeight: '700', marginTop: 8 }]}>
                {row.caseTitle}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
                📍 {[row.courtName, row.courtRoom].filter(Boolean).join(', ') || '—'}
              </Text>

              {isDone ? (
                <>
                  <View style={[styles.doneTag, { backgroundColor: colors.neutral[100] }]}>
                    <Text style={[typography.caption, { fontWeight: '700' }]}>✓ COMPLETED</Text>
                  </View>
                  <Text style={[typography.bodySmall, { fontStyle: 'italic', marginTop: 8 }]}>
                    {drafts[row.hearingId]}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[typography.caption, styles.label]}>HEARING SUMMARY</Text>
                  <TextInput
                    value={drafts[row.hearingId] ?? ''}
                    onChangeText={(text) =>
                      setDrafts((prev) => ({ ...prev, [row.hearingId]: text }))
                    }
                    placeholder="Briefly describe what happened in court…"
                    placeholderTextColor={colors.text.disabled}
                    multiline
                    style={[
                      styles.input,
                      { borderColor: colors.border.default, color: colors.text.primary },
                    ]}
                  />
                  <Pressable
                    onPress={() => void handleSave(row)}
                    disabled={savingId === row.hearingId}
                    style={[
                      styles.primaryBtn,
                      { backgroundColor: colors.primary.main, borderRadius: borderRadius.md },
                    ]}
                  >
                    {savingId === row.hearingId ? (
                      <ActivityIndicator color={colors.primary.contrast} />
                    ) : (
                      <Text style={[typography.button, { color: colors.primary.contrast }]}>
                        Save Outcome
                      </Text>
                    )}
                  </Pressable>
                  <Pressable onPress={() => router.push(diaryRoutes.new)}>
                    <Text
                      style={[
                        typography.label,
                        { color: colors.primary.main, textAlign: 'center', marginTop: 10 },
                      ]}
                    >
                      Create Next Entry
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          );
        })}

        {rows.length === 0 && !isLoading ? (
          <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 16 }]}>
            No hearings today to wrap up.
          </Text>
        ) : null}

        <View
          style={[
            styles.finishCard,
            {
              borderColor: colors.primary.main,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.background.paper,
            },
          ]}
        >
          <Text style={{ fontSize: 28, textAlign: 'center' }}>✓</Text>
          <Text style={[typography.body, { textAlign: 'center', marginTop: 8 }]}>
            Almost Done! Logged {loggedCount} of {rows.length} hearings.
          </Text>
          <Pressable
            onPress={() => router.replace(diaryRoutes.index)}
            style={[
              styles.primaryBtn,
              {
                backgroundColor: colors.secondary.main,
                borderRadius: borderRadius.md,
                marginTop: 14,
              },
            ]}
          >
            <Text style={[typography.button, { color: colors.secondary.contrast }]}>
              Finish Day & Return
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  card: {
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caseTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneTag: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  finishCard: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    marginTop: 20,
    padding: 18,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 80,
    padding: 12,
    textAlignVertical: 'top',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 12,
  },
  primaryBtn: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
  },
  root: { flex: 1 },
});
