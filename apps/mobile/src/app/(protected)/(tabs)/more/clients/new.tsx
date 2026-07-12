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
import { FormField } from '@/features/clients/components';
import { useCreateClient } from '@/features/clients/hooks';
import { clientsRoutes } from '@/features/clients/routes';
import { useAuthContext, useTheme } from '@/providers';

export default function CreateClientScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();
  const createClient = useCreateClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError('Full name is required (min 2 characters).');
      return;
    }
    if (phone.trim().length < 7) {
      setError('A valid phone number is required.');
      return;
    }

    try {
      const client = await createClient.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        fatherName: fatherName.trim() || undefined,
        cnic: cnic.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.replace(clientsRoutes.detail(client.id));
    } catch {
      setError(
        'Failed to save client. Phone or CNIC may already exist in your firm.',
      );
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
          title="New Client"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Add Client</Text>
        <Text
          style={[
            typography.bodySmall,
            {
              color: colors.text.secondary,
              marginTop: 4,
              marginBottom: spacing.lg,
            },
          ]}
        >
          Create a client profile for case filing
        </Text>

        <FormField
          label="Full name"
          required
          value={name}
          onChangeText={setName}
          placeholder="e.g. Malik Arshad"
          autoCapitalize="words"
        />
        <FormField
          label="Phone"
          required
          value={phone}
          onChangeText={setPhone}
          placeholder="03XX-XXXXXXX"
          keyboardType="phone-pad"
        />
        <FormField
          label="Father name"
          value={fatherName}
          onChangeText={setFatherName}
          placeholder="Optional"
          autoCapitalize="words"
        />
        <FormField
          label="CNIC"
          value={cnic}
          onChangeText={setCnic}
          placeholder="42101-1234567-1"
          keyboardType="numbers-and-punctuation"
        />
        <FormField
          label="WhatsApp"
          value={whatsapp}
          onChangeText={setWhatsapp}
          placeholder="Optional"
          keyboardType="phone-pad"
        />
        <FormField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Street, city…"
          multiline
        />
        <FormField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Internal notes about this client"
          multiline
        />

        {error ? (
          <Text style={{ color: colors.error.main, marginBottom: 12 }}>
            {error}
          </Text>
        ) : null}

        <Pressable
          onPress={() => void handleSave()}
          disabled={createClient.isPending}
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              opacity: createClient.isPending ? 0.7 : 1,
            },
          ]}
        >
          {createClient.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[typography.button, { color: '#fff' }]}>
              Save Client
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
