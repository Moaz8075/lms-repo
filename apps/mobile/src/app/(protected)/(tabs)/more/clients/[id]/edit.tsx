import { useEffect, useState } from 'react';
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

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { FormField } from '@/features/clients/components';
import { useClient, useUpdateClient } from '@/features/clients/hooks';
import { clientsRoutes } from '@/features/clients/routes';
import { useAuthContext, useTheme } from '@/providers';

export default function EditClientScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const clientId = id ?? '';
  const { data: client, isLoading } = useClient(clientId);
  const updateClient = useUpdateClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;
    setName(client.name);
    setPhone(client.phone);
    setFatherName(client.fatherName ?? '');
    setCnic(client.cnic ?? '');
    setWhatsapp(client.whatsapp ?? '');
    setAddress(client.address ?? '');
    setNotes(client.notes ?? '');
  }, [client]);

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
      await updateClient.mutateAsync({
        id: clientId,
        payload: {
          name: name.trim(),
          phone: phone.trim(),
          fatherName: fatherName.trim() || undefined,
          cnic: cnic.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });
      router.replace(clientsRoutes.detail(clientId));
    } catch {
      setError(
        'Failed to update client. Phone or CNIC may conflict with another record.',
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
          title="Edit Client"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Edit Client</Text>
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
          Update contact details and notes
        </Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} /> : null}

        {client ? (
          <>
            <FormField
              label="Full name"
              required
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <FormField
              label="Phone"
              required
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <FormField
              label="Father name"
              value={fatherName}
              onChangeText={setFatherName}
              autoCapitalize="words"
            />
            <FormField
              label="CNIC"
              value={cnic}
              onChangeText={setCnic}
              keyboardType="numbers-and-punctuation"
            />
            <FormField
              label="WhatsApp"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
            />
            <FormField
              label="Address"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <FormField
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {error ? (
              <Text style={{ color: colors.error.main, marginBottom: 12 }}>
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={() => void handleSave()}
              disabled={updateClient.isPending}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary.main,
                  borderRadius: borderRadius.md,
                  opacity: updateClient.isPending ? 0.7 : 1,
                },
              ]}
            >
              {updateClient.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[typography.button, { color: '#fff' }]}>
                  Save Changes
                </Text>
              )}
            </Pressable>
          </>
        ) : null}
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
