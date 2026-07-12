import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { FormField } from '@/features/legal-research/components';
import { useCreateLegalNote } from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import {
  parseTagsInput,
  suggestNoteTitle,
} from '@/features/legal-research/utils';
import { useAuthContext, useTheme } from '@/providers';

export default function ScanBookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();
  const createNote = useCreateLegalNote();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [title, setTitle] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [pageNumber, setPageNumber] = useState('1');
  const [citation, setCitation] = useState('');
  const [court, setCourt] = useState('');
  const [tagsInput, setTagsInput] = useState('physical-book');
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (fromCamera: boolean) => {
    setError(null);
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError('Permission is required to capture or upload a page photo.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          quality: 0.8,
          allowsEditing: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
          allowsEditing: true,
          mediaTypes: ['images'],
        });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setError(null);
    const page = Number(pageNumber);
    const text = selectedText.trim();
    if (!text) {
      setError('Enter the text from the scanned page.');
      return;
    }
    if (!Number.isFinite(page) || page < 1) {
      setError('Page number must be at least 1.');
      return;
    }

    const noteTitle = title.trim() || suggestNoteTitle(text);
    const tags = parseTagsInput(tagsInput);
    if (!tags.includes('physical-book')) {
      tags.push('physical-book');
    }

    try {
      const note = await createNote.mutateAsync({
        title: noteTitle,
        pageNumber: page,
        selectedText: text,
        personalNote: personalNote.trim() || undefined,
        citation: citation.trim() || undefined,
        court: court.trim() || undefined,
        tags,
      });
      router.replace(legalResearchRoutes.note(note.id));
    } catch {
      setError('Failed to save scanned note.');
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
          title="Scan Book"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Physical Book Scan</Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Photograph a page, then enter the excerpt to save as a research note
        </Text>

        <View style={[styles.captureRow, { gap: spacing.sm }]}>
          <Pressable
            onPress={() => void pickImage(true)}
            style={[
              styles.captureBtn,
              {
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.md,
                flex: 1,
              },
            ]}
          >
            <Text style={[typography.button, { color: '#fff', textAlign: 'center' }]}>
              📷 Camera
            </Text>
          </Pressable>
          <Pressable
            onPress={() => void pickImage(false)}
            style={[
              styles.captureBtn,
              {
                backgroundColor: colors.secondary.light,
                borderRadius: borderRadius.md,
                flex: 1,
              },
            ]}
          >
            <Text
              style={[
                typography.button,
                { color: colors.secondary.dark, textAlign: 'center' },
              ]}
            >
              🖼 Gallery
            </Text>
          </Pressable>
        </View>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.preview,
              { borderRadius: borderRadius.lg, marginTop: spacing.lg },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                borderColor: colors.border.default,
                borderRadius: borderRadius.lg,
                marginTop: spacing.lg,
              },
            ]}
          >
            <Text style={{ fontSize: 40 }}>📖</Text>
            <Text
              style={[
                typography.bodySmall,
                {
                  color: colors.text.secondary,
                  textAlign: 'center',
                  marginTop: 8,
                },
              ]}
            >
              Capture a clear photo of the page, then type the relevant passage below
            </Text>
          </View>
        )}

        <View style={{ marginTop: spacing.lg }}>
          <FormField
            label="Excerpt from page"
            value={selectedText}
            onChangeText={setSelectedText}
            multiline
            placeholder="Type or paste the text from the photographed page…"
          />
          <FormField
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Auto-suggested from excerpt if empty"
          />
          <FormField
            label="Page number"
            value={pageNumber}
            onChangeText={setPageNumber}
            keyboardType="number-pad"
          />
          <FormField
            label="Citation"
            value={citation}
            onChangeText={setCitation}
          />
          <FormField label="Court / publisher" value={court} onChangeText={setCourt} />
          <FormField
            label="Personal note"
            value={personalNote}
            onChangeText={setPersonalNote}
            multiline
          />
          <FormField
            label="Tags"
            value={tagsInput}
            onChangeText={setTagsInput}
          />
        </View>

        {error ? (
          <Text style={{ color: colors.error.main, marginBottom: 12 }}>{error}</Text>
        ) : null}

        <Pressable
          onPress={() => void handleSave()}
          disabled={createNote.isPending}
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              opacity: createNote.isPending ? 0.7 : 1,
            },
          ]}
        >
          {createNote.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[typography.button, { color: '#fff' }]}>
              Save Scanned Note
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  captureBtn: { paddingVertical: 14 },
  captureRow: { flexDirection: 'row' },
  placeholder: {
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 160,
    padding: 24,
  },
  preview: { height: 220, width: '100%' },
  root: { flex: 1 },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
