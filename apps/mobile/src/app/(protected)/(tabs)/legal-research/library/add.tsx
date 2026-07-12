import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import {
  CategoryChips,
  FormField,
} from '@/features/legal-research/components';
import { useCreateLibraryItem } from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import { parseTagsInput } from '@/features/legal-research/utils';
import { useAuthContext, useTheme } from '@/providers';
import { LIBRARY_CATEGORIES } from '@/types';

const CATEGORY_OPTIONS = LIBRARY_CATEGORIES.filter((c) => c !== 'All');

export default function AddLibraryItemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();
  const createItem = useCreateLibraryItem();

  const [title, setTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [citation, setCitation] = useState('');
  const [court, setCourt] = useState('');
  const [category, setCategory] = useState('Judgment');
  const [jurisdiction, setJurisdiction] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!pdfUrl.trim() || !/^https?:\/\//i.test(pdfUrl.trim())) {
      setError('A valid PDF URL (http/https) is required.');
      return;
    }

    const yearNum = year.trim() ? Number(year) : undefined;
    const pagesNum = totalPages.trim() ? Number(totalPages) : undefined;

    try {
      const item = await createItem.mutateAsync({
        title: title.trim(),
        pdfUrl: pdfUrl.trim(),
        citation: citation.trim() || undefined,
        court: court.trim() || undefined,
        category,
        jurisdiction: jurisdiction.trim() || undefined,
        year: yearNum && Number.isFinite(yearNum) ? yearNum : undefined,
        author: author.trim() || undefined,
        totalPages:
          pagesNum && Number.isFinite(pagesNum) ? pagesNum : undefined,
        description: description.trim() || undefined,
        tags: parseTagsInput(tagsInput),
      });
      router.replace(legalResearchRoutes.libraryItem(item.id));
    } catch {
      setError('Failed to add document. Check the URL and try again.');
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
          title="Add Document"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Add to Library</Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Link a PDF judgment, book, statute or article
        </Text>

        <FormField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Document title"
        />
        <FormField
          label="PDF URL"
          value={pdfUrl}
          onChangeText={setPdfUrl}
          placeholder="https://…"
          autoCapitalize="none"
          keyboardType="url"
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
          Category
        </Text>
        <View style={{ marginBottom: spacing.md }}>
          <CategoryChips
            categories={CATEGORY_OPTIONS}
            selected={category}
            onSelect={setCategory}
          />
        </View>

        <FormField label="Citation" value={citation} onChangeText={setCitation} />
        <FormField label="Court" value={court} onChangeText={setCourt} />
        <FormField
          label="Jurisdiction"
          value={jurisdiction}
          onChangeText={setJurisdiction}
        />
        <FormField
          label="Year"
          value={year}
          onChangeText={setYear}
          keyboardType="number-pad"
        />
        <FormField label="Author" value={author} onChangeText={setAuthor} />
        <FormField
          label="Total pages"
          value={totalPages}
          onChangeText={setTotalPages}
          keyboardType="number-pad"
        />
        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <FormField
          label="Tags"
          value={tagsInput}
          onChangeText={setTagsInput}
          placeholder="comma separated"
        />

        {error ? (
          <Text style={{ color: colors.error.main, marginBottom: 12 }}>{error}</Text>
        ) : null}

        <Pressable
          onPress={() => void handleSave()}
          disabled={createItem.isPending}
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              opacity: createItem.isPending ? 0.7 : 1,
            },
          ]}
        >
          {createItem.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[typography.button, { color: '#fff' }]}>
              Save Document
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
