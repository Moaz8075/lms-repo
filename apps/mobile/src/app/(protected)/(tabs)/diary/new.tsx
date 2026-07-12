import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { useCases } from '@/features/cases/hooks/useCases';
import { useCreateHearing } from '@/features/diary/hooks/useDiary';
import { diaryRoutes } from '@/features/diary/routes';
import { toLocalDateString } from '@/features/diary/utils/diary-format';
import { HEARING_PURPOSE_OPTIONS } from '@/types/diary';
import { useAuthContext, useTheme } from '@/providers';

export default function AddDiaryEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();
  const createHearing = useCreateHearing();

  const [caseSearch, setCaseSearch] = useState('');
  const [caseId, setCaseId] = useState('');
  const [hearingDate, setHearingDate] = useState(params.date ?? toLocalDateString());
  const [time, setTime] = useState('09:00');
  const [purpose, setPurpose] = useState<string>(HEARING_PURPOSE_OPTIONS[0]);
  const [courtRoom, setCourtRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [nextHearingDate, setNextHearingDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: casesData } = useCases({
    page: 1,
    limit: 50,
    search: caseSearch.trim() || undefined,
    ongoing: true,
  });

  const selectedCase = useMemo(
    () => casesData?.items.find((item) => item.id === caseId),
    [casesData?.items, caseId],
  );

  const handleSave = async () => {
    setError(null);
    if (!caseId) {
      setError('Please select a case.');
      return;
    }
    if (!hearingDate || !time) {
      setError('Date and time are required.');
      return;
    }

    try {
      const created = await createHearing.mutateAsync({
        caseId,
        hearingDate,
        time,
        purpose,
        courtRoom: courtRoom.trim() || undefined,
        notes: notes.trim() || undefined,
        nextHearingDate: nextHearingDate.trim() || undefined,
      });
      router.replace(diaryRoutes.entry(created.id));
    } catch {
      setError('Failed to save diary entry. Please try again.');
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
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Add Diary Entry"
          showBack
          onBack={() => router.back()}
        />

        <View style={[styles.card, { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg }]}>
          <Text style={[typography.caption, styles.label]}>SELECT CASE</Text>
          <TextInput
            value={caseSearch}
            onChangeText={setCaseSearch}
            placeholder="Search active cases…"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />
          {(casesData?.items ?? []).slice(0, 8).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setCaseId(item.id)}
              style={[
                styles.caseItem,
                {
                  backgroundColor:
                    caseId === item.id ? colors.primary.light : colors.neutral[100],
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <Text style={[typography.body, { fontWeight: '600' }]}>{item.title}</Text>
              <Text style={[typography.caption, { color: colors.text.secondary }]}>
                #{item.caseNumber}
              </Text>
            </Pressable>
          ))}

          <Text style={[typography.caption, styles.label]}>DIARY DATE (YYYY-MM-DD)</Text>
          <TextInput
            value={hearingDate}
            onChangeText={setHearingDate}
            placeholder="2026-07-11"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />

          <Text style={[typography.caption, styles.label]}>HEARING TIME (HH:mm)</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="09:30"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />

          <Text style={[typography.caption, styles.label]}>HEARING ACTION</Text>
          <View style={styles.chipRow}>
            {HEARING_PURPOSE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setPurpose(option)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: purpose === option ? colors.primary.light : colors.background.paper,
                    borderColor: purpose === option ? colors.primary.main : colors.border.default,
                  },
                ]}
              >
                <Text style={{ fontSize: 12, fontWeight: '600' }}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[typography.caption, styles.label]}>COURT ROOM</Text>
          <TextInput
            value={courtRoom}
            onChangeText={setCourtRoom}
            placeholder="Bench IV / Room 12"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />

          <Text style={[typography.caption, styles.label]}>COURT ORDER / REMARKS</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Briefly summarize today's court proceedings…"
            placeholderTextColor={colors.text.disabled}
            multiline
            style={[
              styles.input,
              styles.textArea,
              { borderColor: colors.border.default, color: colors.text.primary },
            ]}
          />

          <Text style={[typography.caption, styles.label]}>NEXT HEARING DATE (optional)</Text>
          <TextInput
            value={nextHearingDate}
            onChangeText={setNextHearingDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />
        </View>

        <View
          style={[
            styles.contextCard,
            { backgroundColor: colors.primary.light, borderRadius: borderRadius.lg },
          ]}
        >
          <Text style={[typography.caption, { fontWeight: '700', color: colors.primary.dark }]}>
            CASE CONTEXT
          </Text>
          {selectedCase ? (
            <>
              <Text style={[typography.body, { fontWeight: '700', marginTop: 8 }]}>
                {selectedCase.title}
              </Text>
              <Text style={[typography.bodySmall, { marginTop: 4 }]}>
                Court: {selectedCase.courtName ?? '—'}
              </Text>
              <Text style={[typography.bodySmall, { marginTop: 2 }]}>
                Client: {selectedCase.client?.name ?? '—'}
              </Text>
              <Text style={[typography.bodySmall, { marginTop: 2 }]}>
                Lawyer: {selectedCase.assignedLawyer?.name ?? 'Unassigned'}
              </Text>
            </>
          ) : (
            <Text style={[typography.bodySmall, { marginTop: 8, color: colors.text.secondary }]}>
              Select a case to see active counsel and court details.
            </Text>
          )}
        </View>

        {error ? <Text style={{ color: colors.error.main, marginTop: 12 }}>{error}</Text> : null}

        <Pressable
          onPress={() => void handleSave()}
          disabled={createHearing.isPending}
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          {createHearing.isPending ? (
            <ActivityIndicator color={colors.primary.contrast} />
          ) : (
            <Text style={[typography.button, { color: colors.primary.contrast }]}>Save Entry</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  caseItem: { marginBottom: 6, paddingHorizontal: 12, paddingVertical: 10 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  contextCard: { marginTop: 16, padding: 16 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: { fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, marginTop: 4 },
  root: { flex: 1 },
  saveBtn: { alignItems: 'center', paddingVertical: 14 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
});
