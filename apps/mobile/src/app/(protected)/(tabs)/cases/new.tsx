import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { useCreateCase } from '@/features/cases/hooks/useCases';
import { useClients } from '@/features/cases/hooks/useClients';
import { CASE_TYPE_OPTIONS, formatCaseType } from '@/features/cases/utils/case-format';
import { useAuthContext, useTheme } from '@/providers';

export default function NewCaseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();
  const createCase = useCreateCase();

  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [title, setTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseType, setCaseType] = useState('CIVIL');
  const [courtName, setCourtName] = useState('');
  const [opponentParty, setOpponentParty] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: clientsData } = useClients(clientSearch);

  const handleSubmit = async () => {
    setError(null);
    if (!selectedClientId) {
      setError('Please select a client.');
      return;
    }
    if (!opponentParty.trim()) {
      setError('Opponent party is required.');
      return;
    }

    try {
      const created = await createCase.mutateAsync({
        clientId: selectedClientId,
        opponentParty: opponentParty.trim(),
        title: title.trim() || undefined,
        caseNumber: caseNumber.trim() || undefined,
        caseType,
        courtName: courtName.trim() || undefined,
      });
      router.replace(`/(protected)/(tabs)/cases/${created.id}`);
    } catch {
      setError('Failed to create case. Please try again.');
    }
  };

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 96,
        }}
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Add New Case"
          showBack
          onBack={() => router.back()}
        />

        <Text style={[typography.caption, { color: colors.text.secondary }]}>Step 1: Case Information</Text>

        <View style={[styles.card, { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg }]}>
          <Text style={[typography.caption, styles.label]}>CLIENT</Text>
          <TextInput
            value={clientSearch}
            onChangeText={setClientSearch}
            placeholder="Search client…"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />
          <View style={styles.clientList}>
            {(clientsData?.items ?? []).map((client) => (
              <Pressable
                key={client.id}
                onPress={() => setSelectedClientId(client.id)}
                style={[
                  styles.clientItem,
                  {
                    backgroundColor:
                      selectedClientId === client.id ? colors.primary.light : colors.neutral[100],
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Text style={[typography.body, { fontWeight: '600' }]}>{client.name}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[typography.caption, styles.label]}>CASE TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. State vs. Sheikh Mohammed"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />

          <Text style={[typography.caption, styles.label]}>CASE NUMBER</Text>
          <TextInput
            value={caseNumber}
            onChangeText={setCaseNumber}
            placeholder="Auto-generated if empty"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />

          <Text style={[typography.caption, styles.label]}>CASE TYPE</Text>
          <View style={styles.chipRow}>
            {CASE_TYPE_OPTIONS.map((type) => (
              <Pressable
                key={type}
                onPress={() => setCaseType(type)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: caseType === type ? colors.primary.light : colors.background.paper,
                    borderColor: caseType === type ? colors.primary.main : colors.border.default,
                  },
                ]}
              >
                <Text style={{ fontSize: 13, fontWeight: '600' }}>{formatCaseType(type)}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[typography.caption, styles.label]}>COURT NAME</Text>
          <TextInput
            value={courtName}
            onChangeText={setCourtName}
            placeholder="High Court, Lahore"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />

          <Text style={[typography.caption, styles.label]}>OPPONENT PARTY *</Text>
          <TextInput
            value={opponentParty}
            onChangeText={setOpponentParty}
            placeholder="Metro Corp Ltd."
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, { borderColor: colors.border.default, color: colors.text.primary }]}
          />
        </View>

        {error ? <Text style={{ color: colors.error.main, marginTop: 12 }}>{error}</Text> : null}

        <Pressable
          onPress={() => void handleSubmit()}
          disabled={createCase.isPending}
          style={[
            styles.submit,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          {createCase.isPending ? (
            <ActivityIndicator color={colors.primary.contrast} />
          ) : (
            <Text style={[typography.button, { color: colors.primary.contrast }]}>Create Case</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  chip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  clientItem: { marginBottom: 6, paddingHorizontal: 12, paddingVertical: 10 },
  clientList: { marginBottom: 12 },
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
  submit: { alignItems: 'center', paddingVertical: 14 },
});
