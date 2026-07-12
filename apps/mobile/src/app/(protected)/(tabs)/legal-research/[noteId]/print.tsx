import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { FormField } from '@/features/legal-research/components';
import { useLegalNote } from '@/features/legal-research/hooks';
import { buildLegalNotePrintHtml } from '@/features/legal-research/utils';
import { useCases } from '@/features/cases/hooks/useCases';
import { useAuthContext, useTheme } from '@/providers';

function isUserCancelError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = String(
    (error as { message?: string }).message ?? error,
  ).toLowerCase();
  return (
    message.includes('cancel') ||
    message.includes('dismiss') ||
    message.includes('user did not share')
  );
}

export default function PrintLegalNoteScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const insets = useSafeAreaInsets();
  const { user, organization } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const id = noteId ?? '';
  const { data: note, isLoading } = useLegalNote(id);
  const { data: casesData } = useCases({ page: 1, limit: 50 });

  const defaultLawyer = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : '';
  const [lawyerName, setLawyerName] = useState(defaultLawyer);
  const [caseId, setCaseId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCase = useMemo(
    () => casesData?.items.find((item) => item.id === caseId) ?? null,
    [casesData?.items, caseId],
  );

  const handlePrint = async () => {
    if (!note) {
      setError('Note is still loading. Try again in a moment.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const html = buildLegalNotePrintHtml({
        note,
        organizationName: organization?.name || 'LegalEase',
        organizationAddress: organization?.address,
        organizationPhone: organization?.phone,
        lawyerName: lawyerName.trim() || defaultLawyer || 'Advocate',
        caseData: selectedCase,
      });

      // Prefer native print dialog — most reliable across Expo Go / devices.
      try {
        await Print.printAsync({ html });
        return;
      } catch (printError) {
        if (isUserCancelError(printError)) return;
        // Fall through to file + share path.
      }

      const file = await Print.printToFileAsync({ html });
      if (!file?.uri) {
        throw new Error('PDF file was not created');
      }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        try {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Legal Research Memorandum',
            UTI: 'com.adobe.pdf',
          });
        } catch (shareError) {
          if (!isUserCancelError(shareError)) {
            throw shareError;
          }
        }
      } else {
        setError('Sharing is not available on this device. Use Print instead.');
      }
    } catch (err) {
      if (isUserCancelError(err)) return;
      const message =
        err instanceof Error ? err.message : 'Unable to generate print PDF.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const handleShareOnly = async () => {
    if (!note) return;
    setBusy(true);
    setError(null);

    try {
      const html = buildLegalNotePrintHtml({
        note,
        organizationName: organization?.name || 'LegalEase',
        organizationAddress: organization?.address,
        organizationPhone: organization?.phone,
        lawyerName: lawyerName.trim() || defaultLawyer || 'Advocate',
        caseData: selectedCase,
      });

      const file = await Print.printToFileAsync({ html });
      if (!file?.uri) throw new Error('PDF file was not created');

      if (!(await Sharing.isAvailableAsync())) {
        setError('Sharing is not available on this device.');
        return;
      }

      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Legal Research Memorandum',
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      if (isUserCancelError(err)) return;
      const message =
        err instanceof Error ? err.message : 'Unable to share PDF.';
      setError(message);
    } finally {
      setBusy(false);
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
        keyboardShouldPersistTaps="handled"
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Print Memo"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Court Memorandum</Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Generate a printable PDF for court submission
        </Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} /> : null}

        {note ? (
          <>
            <View
              style={[
                styles.preview,
                {
                  backgroundColor: colors.background.paper,
                  borderRadius: borderRadius.lg,
                  borderColor: colors.border.default,
                },
              ]}
            >
              <Text style={[typography.caption, { color: colors.text.secondary }]}>
                PREVIEW
              </Text>
              <Text style={[typography.h3, { marginTop: 8, fontSize: 16 }]}>
                {note.title}
              </Text>
              <Text
                style={[
                  typography.bodySmall,
                  { fontStyle: 'italic', marginTop: 8, color: colors.text.secondary },
                ]}
                numberOfLines={4}
              >
                “{note.selectedText}”
              </Text>
            </View>

            <FormField
              label="Lawyer name (signature)"
              value={lawyerName}
              onChangeText={setLawyerName}
            />

            <Text
              style={[
                typography.caption,
                {
                  color: colors.text.secondary,
                  fontWeight: '700',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                },
              ]}
            >
              Optional case reference
            </Text>
            <View style={{ gap: 8, marginBottom: spacing.lg }}>
              <Pressable
                onPress={() => setCaseId('')}
                style={[
                  styles.caseRow,
                  {
                    borderColor: !caseId
                      ? colors.primary.main
                      : colors.border.default,
                    backgroundColor: !caseId
                      ? colors.primary.light
                      : colors.background.paper,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Text style={typography.bodySmall}>No case reference</Text>
              </Pressable>
              {(casesData?.items ?? []).slice(0, 8).map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setCaseId(item.id)}
                  style={[
                    styles.caseRow,
                    {
                      borderColor:
                        caseId === item.id
                          ? colors.primary.main
                          : colors.border.default,
                      backgroundColor:
                        caseId === item.id
                          ? colors.primary.light
                          : colors.background.paper,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  <Text style={[typography.bodySmall, { fontWeight: '700' }]}>
                    {item.caseNumber}
                  </Text>
                  <Text
                    style={[typography.caption, { color: colors.text.secondary }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>

            {error ? (
              <Text style={{ color: colors.error.main, marginBottom: 12 }}>
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={() => void handlePrint()}
              disabled={busy}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary.main,
                  borderRadius: borderRadius.md,
                  opacity: busy ? 0.7 : 1,
                },
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[typography.button, { color: '#fff' }]}>
                  Print Memorandum
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => void handleShareOnly()}
              disabled={busy}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.secondary.light,
                  borderRadius: borderRadius.md,
                  marginTop: spacing.sm,
                  opacity: busy ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  typography.button,
                  { color: colors.secondary.dark },
                ]}
              >
                Share as PDF
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  caseRow: { borderWidth: 1, padding: 12 },
  preview: { borderWidth: 1, marginBottom: 20, padding: 16 },
  root: { flex: 1 },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
