import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/providers';
import { CASE_STATUS_FILTER_OPTIONS, CASE_TYPE_OPTIONS, formatCaseType } from '@/features/cases/utils/case-format';
import type { CaseFilters } from '@/types';

interface CaseFilterSheetProps {
  visible: boolean;
  filters: CaseFilters;
  courtOptions: string[];
  onChange: (filters: CaseFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

export function CaseFilterSheet({
  visible,
  filters,
  courtOptions,
  onChange,
  onClose,
  onApply,
  onReset,
}: CaseFilterSheetProps) {
  const { typography, colors, borderRadius, spacing } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background.paper,
              borderTopLeftRadius: borderRadius['2xl'],
              borderTopRightRadius: borderRadius['2xl'],
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: colors.neutral[300] }]} />
          <View style={styles.header}>
            <Text style={[typography.h3, { fontWeight: '700' }]}>Filter Cases</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={{ fontSize: 22, color: colors.text.secondary }}>×</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
            <Text style={[typography.caption, styles.sectionLabel]}>COURT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={styles.chipRow}>
                <FilterChip
                  label="All Courts"
                  selected={!filters.courtName}
                  onPress={() => onChange({ ...filters, courtName: undefined })}
                />
                {courtOptions.map((court) => (
                  <FilterChip
                    key={court}
                    label={court}
                    selected={filters.courtName === court}
                    onPress={() => onChange({ ...filters, courtName: court })}
                  />
                ))}
              </View>
            </ScrollView>

            <Text style={[typography.caption, styles.sectionLabel]}>CASE TYPE</Text>
            <View style={[styles.chipRow, { marginBottom: 16 }]}>
              <FilterChip
                label="All"
                selected={!filters.caseType}
                onPress={() => onChange({ ...filters, caseType: undefined })}
              />
              {CASE_TYPE_OPTIONS.map((type) => (
                <FilterChip
                  key={type}
                  label={formatCaseType(type)}
                  selected={filters.caseType === type}
                  onPress={() => onChange({ ...filters, caseType: type })}
                />
              ))}
            </View>

            <Text style={[typography.caption, styles.sectionLabel]}>STATUS</Text>
            <View style={[styles.chipRow, { marginBottom: 16 }]}>
              <FilterChip
                label="All"
                selected={!filters.status}
                onPress={() => onChange({ ...filters, status: undefined })}
              />
              {CASE_STATUS_FILTER_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={filters.status === option.value}
                  onPress={() => onChange({ ...filters, status: option.value })}
                />
              ))}
            </View>

            <Text style={[typography.caption, styles.sectionLabel]}>CLIENT</Text>
            <TextInput
              value={filters.clientSearch ?? ''}
              onChangeText={(clientSearch) => onChange({ ...filters, clientSearch })}
              placeholder="Search client name…"
              placeholderTextColor={colors.text.disabled}
              style={[
                styles.input,
                {
                  borderColor: colors.border.default,
                  borderRadius: borderRadius.md,
                  color: colors.text.primary,
                },
              ]}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={onReset}
              style={[styles.resetBtn, { borderColor: colors.border.default, borderRadius: borderRadius.md }]}
            >
              <Text style={[typography.button, { color: colors.text.primary }]}>Reset</Text>
            </Pressable>
            <Pressable
              onPress={onApply}
              style={[styles.applyBtn, { backgroundColor: colors.primary.main, borderRadius: borderRadius.md }]}
            >
              <Text style={[typography.button, { color: colors.primary.contrast }]}>Apply Filters</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? '#E8F0FE' : '#FFFFFF',
          borderColor: selected ? '#1A73E8' : '#E5E7EB',
        },
      ]}
    >
      <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? '#1A73E8' : '#374151' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  applyBtn: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 14,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    borderRadius: 4,
    height: 4,
    marginBottom: 12,
    width: 40,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  resetBtn: {
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  sheet: {
    maxHeight: '85%',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
