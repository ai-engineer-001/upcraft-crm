# React Native / Expo Migration Prompt for UpCraft CRM

> **Purpose**: This document is a comprehensive prompt for AI (Claude Sonnet 4.5 via Copilot) to recreate the complete UpCraft CRM interface in React Native with Expo. The "Projects" sidebar button will render this entire application as a section.

---

## 🎨 DESIGN SYSTEM - LIGHT THEME WITH CYAN

### Color Palette (MANDATORY)

```typescript
// theme/colors.ts
export const colors = {
  // Primary - Cyan accent
  primary: '#06B6D4',         // Cyan-500
  primaryLight: '#22D3EE',    // Cyan-400
  primaryDark: '#0891B2',     // Cyan-600
  primaryMuted: 'rgba(6, 182, 212, 0.1)',
  primaryGlow: 'rgba(6, 182, 212, 0.3)',

  // Secondary - Teal
  secondary: '#14B8A6',       // Teal-500
  secondaryLight: '#2DD4BF',  // Teal-400

  // Background (Light Theme)
  background: '#F8FAFC',      // Slate-50
  backgroundAlt: '#F1F5F9',   // Slate-100
  card: '#FFFFFF',
  cardHover: '#F8FAFC',

  // Text
  foreground: '#0F172A',      // Slate-900
  foregroundMuted: '#64748B', // Slate-500
  foregroundSubtle: '#94A3B8', // Slate-400

  // Borders
  border: '#E2E8F0',          // Slate-200
  borderFocus: '#06B6D4',     // Cyan-500
  borderMuted: '#F1F5F9',     // Slate-100

  // Status Colors
  success: '#22C55E',         // Green-500
  successBg: 'rgba(34, 197, 94, 0.1)',
  warning: '#F59E0B',         // Amber-500
  warningBg: 'rgba(245, 158, 11, 0.1)',
  destructive: '#EF4444',     // Red-500
  destructiveBg: 'rgba(239, 68, 68, 0.1)',
  info: '#3B82F6',            // Blue-500
  infoBg: 'rgba(59, 130, 246, 0.1)',

  // Priority Colors
  priorityUrgent: '#EF4444',
  priorityHigh: '#F97316',
  priorityMedium: '#EAB308',
  priorityLow: '#3B82F6',
} as const;
```

### Typography

```typescript
// theme/typography.ts
export const typography = {
  fontFamily: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
} as const;
```

### Spacing & Borders

```typescript
// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
```

### Shadows

```typescript
// theme/shadows.ts
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  glow: {
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
```

---

## 📁 PROJECT STRUCTURE

```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with sidebar
│   ├── index.tsx          # Dashboard (home)
│   ├── workspace/
│   │   └── [clientId].tsx # Client workspace screen
│   └── outreach.tsx       # Outreach tracker
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── ClientCard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── AddClientModal.tsx
│   ├── workspace/
│   │   ├── ClientWorkspace.tsx
│   │   ├── RequirementBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── AddScopeModal.tsx
│   │   ├── DocumentManager.tsx
│   │   └── ConfirmDialog.tsx
│   ├── outreach/
│   │   ├── OutreachTracker.tsx
│   │   ├── OutreachCard.tsx
│   │   ├── OutreachStats.tsx
│   │   └── AddLeadModal.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── PriorityBadge.tsx
│       ├── PrioritySelect.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Switch.tsx
│       ├── SearchBar.tsx
│       ├── AnimatedView.tsx
│       └── GlassCard.tsx
├── hooks/
│   ├── useProjectData.ts
│   ├── useAnimations.ts
│   └── useTheme.ts
├── data/
│   ├── mockData.ts
│   └── outreachData.ts
├── types/
│   ├── project.ts
│   └── outreach.ts
└── theme/
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── index.ts
```

---

## 📋 TYPE DEFINITIONS

### Project Types

```typescript
// types/project.ts
export type ClientStatus = 'Active' | 'Completed' | 'Archived';
export type AgreementStatus = 'Pending' | 'Signed';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export const PRIORITY_ORDER: Record<Priority, number> = {
  'Urgent': 0,
  'High': 1,
  'Medium': 2,
  'Low': 3,
};

export interface Document {
  id: string;
  client_id: string;
  name: string;
  type: 'agreement' | 'contract' | 'proposal' | 'other';
  file_url: string;
  uploaded_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  agreement_status: AgreementStatus;
  agreement_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  status: ProjectStatus;
  priority: Priority;
  start_date: string;
  deadline: string;
  created_at: string;
}

export interface Requirement {
  id: string;
  project_id: string;
  title: string;
  description: string;
  is_additional_scope: boolean;
  priority: Priority;
  created_at: string;
}

export interface Subtask {
  id: string;
  requirement_id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assigned_to?: string;
  created_at: string;
}

export interface ClientWithProject extends Client {
  projects: ProjectWithProgress[];
  documents: Document[];
}

export interface ProjectWithProgress extends Project {
  requirements: RequirementWithTasks[];
  progress: number;
}

export interface RequirementWithTasks extends Requirement {
  subtasks: Subtask[];
}
```

### Outreach Types

```typescript
// types/outreach.ts
export type OutreachStatus = 'Identified' | 'Contacted' | 'Replied' | 'In-Talks' | 'Converted' | 'Lost';

export const OUTREACH_STATUSES: OutreachStatus[] = [
  'Identified', 'Contacted', 'Replied', 'In-Talks', 'Converted', 'Lost'
];

export const STATUS_COLORS: Record<OutreachStatus, { bg: string; text: string }> = {
  'Identified': { bg: 'rgba(148, 163, 184, 0.2)', text: '#64748B' },
  'Contacted': { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6' },
  'Replied': { bg: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B' },
  'In-Talks': { bg: 'rgba(139, 92, 246, 0.2)', text: '#8B5CF6' },
  'Converted': { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E' },
  'Lost': { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444' },
};

export type ContactPlatform = 'LinkedIn' | 'Twitter' | 'Email' | 'Other';

export interface OutreachRecord {
  id: string;
  status: OutreachStatus;
  startupName: string;
  founder: string;
  contactLink: string;
  contactPlatform: ContactPlatform;
  techStack: string;
  problemType: string;
  specificIssue: string;
  auditLink: string;
  outreachDate: string;
  nextAction: string;
}
```

---

## 🧩 COMPONENT IMPLEMENTATIONS

### 1. GlassCard Component

```tsx
// components/ui/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import { colors, shadows, borderRadius } from '@/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  hoverable?: boolean;
}

export function GlassCard({ children, style, onPress, hoverable = true }: GlassCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    if (hoverable) {
      scale.value = withTiming(1.02, { duration: 150 });
      translateY.value = withTiming(-4, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (hoverable) {
      scale.value = withTiming(1, { duration: 150 });
      translateY.value = withTiming(0, { duration: 150 });
    }
  };

  return (
    <Animated.View
      style={[styles.card, animatedStyle, style]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadows.md,
  },
});
```

### 2. Button Component

```tsx
// components/ui/Button.tsx
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator 
} from 'react-native';
import { colors, typography, borderRadius, shadows } from '@/theme';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'glow' | 'success' | 'warning';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  disabled,
  loading,
  icon,
  style,
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#fff'} />
      ) : (
        <>
          {icon}
          {typeof children === 'string' ? (
            <Text style={textStyles}>{children}</Text>
          ) : children}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: borderRadius.lg,
  },
  default: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  destructive: {
    backgroundColor: colors.destructive,
    ...shadows.md,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  glow: {
    backgroundColor: colors.primary,
    ...shadows.glow,
  },
  success: {
    backgroundColor: colors.success,
    ...shadows.md,
  },
  warning: {
    backgroundColor: colors.warning,
    ...shadows.md,
  },
  size_default: {
    height: 44,
    paddingHorizontal: 16,
  },
  size_sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  size_lg: {
    height: 48,
    paddingHorizontal: 24,
  },
  size_icon: {
    height: 44,
    width: 44,
    paddingHorizontal: 0,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  text_default: { color: '#FFFFFF' },
  text_destructive: { color: '#FFFFFF' },
  text_outline: { color: colors.foreground },
  text_ghost: { color: colors.foreground },
  text_glow: { color: '#FFFFFF' },
  text_success: { color: '#FFFFFF' },
  text_warning: { color: colors.foreground },
  textSize_default: { fontSize: 14 },
  textSize_sm: { fontSize: 12 },
  textSize_lg: { fontSize: 16 },
  textSize_icon: { fontSize: 14 },
  disabled: {
    opacity: 0.5,
  },
});
```

### 3. Badge Component

```tsx
// components/ui/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borderRadius } from '@/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'muted' | 'scope';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'default', style, icon }: BadgeProps) {
  const variantStyles = {
    default: { bg: colors.primaryMuted, text: colors.primary },
    success: { bg: colors.successBg, text: colors.success },
    warning: { bg: colors.warningBg, text: colors.warning },
    destructive: { bg: colors.destructiveBg, text: colors.destructive },
    info: { bg: colors.infoBg, text: colors.info },
    muted: { bg: colors.backgroundAlt, text: colors.foregroundMuted },
    scope: { bg: colors.warningBg, text: colors.warning },
  };

  const currentStyle = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: currentStyle.bg }, style]}>
      {icon}
      <Text style={[styles.text, { color: currentStyle.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: 12,
  },
});
```

### 4. PriorityBadge Component

```tsx
// components/ui/PriorityBadge.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Flag } from 'lucide-react-native';
import { Priority } from '@/types/project';
import { typography, borderRadius } from '@/theme';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const priorityConfig: Record<Priority, { color: string; bgColor: string; label: string }> = {
  'Urgent': { color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)', label: 'Urgent' },
  'High': { color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.1)', label: 'High' },
  'Medium': { color: '#EAB308', bgColor: 'rgba(234, 179, 8, 0.1)', label: 'Medium' },
  'Low': { color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', label: 'Low' },
};

export function PriorityBadge({ priority, showLabel = false, size = 'sm', style }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const iconSize = size === 'sm' ? 12 : 16;

  return (
    <View style={[
      styles.container,
      { backgroundColor: config.bgColor },
      size === 'sm' ? styles.sizeSm : styles.sizeMd,
      style
    ]}>
      <Flag size={iconSize} color={config.color} fill={config.color} />
      {showLabel && (
        <Text style={[
          styles.label,
          { color: config.color },
          size === 'sm' ? styles.labelSm : styles.labelMd
        ]}>
          {config.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: borderRadius.full,
  },
  sizeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sizeMd: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
  },
  labelSm: {
    fontSize: 12,
  },
  labelMd: {
    fontSize: 14,
  },
});
```

### 5. Progress Bar Component

```tsx
// components/ui/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withDelay 
} from 'react-native-reanimated';
import { colors, borderRadius } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number;
  height?: number;
  style?: ViewStyle;
  delay?: number;
  showGradient?: boolean;
  isComplete?: boolean;
}

export function ProgressBar({ 
  progress, 
  height = 6, 
  style, 
  delay = 0,
  showGradient = true,
  isComplete = false,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withDelay(delay, withTiming(progress, { duration: 800 }));
  }, [progress, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[styles.track, { height }, style]}>
      <Animated.View style={[styles.fill, animatedStyle]}>
        {isComplete ? (
          <View style={[styles.completeFill, { height }]} />
        ) : showGradient ? (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, { height }]}
          />
        ) : (
          <View style={[styles.solidFill, { height }]} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: borderRadius.full,
  },
  solidFill: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  completeFill: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
});
```

### 6. SearchBar Component

```tsx
// components/ui/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, typography, borderRadius, spacing } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search...', 
  style 
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      <Search size={16} color={colors.foregroundMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.foregroundMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },
});
```

---

## 📊 DASHBOARD IMPLEMENTATION

### Dashboard Screen

```tsx
// components/dashboard/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LayoutGrid, Users, FolderKanban, TrendingUp } from 'lucide-react-native';
import { ClientWithProject, Priority } from '@/types/project';
import { ClientCard } from './ClientCard';
import { StatsCard } from './StatsCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { AddClientModal } from './AddClientModal';
import { colors, typography, spacing } from '@/theme';
import { Filter, Plus, Megaphone, FileWarning, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react-native';

interface DashboardProps {
  clients: ClientWithProject[];
  completedClients: ClientWithProject[];
  onClientPress: (clientId: string) => void;
  onAddClient: (name: string, email: string, projectName: string, priority: Priority) => void;
  onOutreachPress: () => void;
}

export function Dashboard({ 
  clients, 
  completedClients, 
  onClientPress, 
  onAddClient,
  onOutreachPress 
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoAgreement, setShowNoAgreement] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter clients
  const filteredClients = useMemo(() => {
    let result = clients;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.projects.some(p => p.name.toLowerCase().includes(query))
      );
    }
    if (showNoAgreement) {
      result = result.filter(c => c.agreement_status === 'Pending');
    }
    return result;
  }, [clients, searchQuery, showNoAgreement]);

  // Calculate stats
  const totalTasks = clients.reduce((acc, client) => 
    acc + client.projects.reduce((pAcc, project) => 
      pAcc + project.requirements.reduce((rAcc, req) => rAcc + req.subtasks.length, 0), 0
    ), 0
  );

  const completedTasks = clients.reduce((acc, client) => 
    acc + client.projects.reduce((pAcc, project) => 
      pAcc + project.requirements.reduce((rAcc, req) => 
        rAcc + req.subtasks.filter(t => t.status === 'Done').length, 0
      ), 0
    ), 0
  );

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Active Clients', value: clients.length, Icon: Users, color: colors.primary },
    { label: 'Total Projects', value: clients.reduce((acc, c) => acc + c.projects.length, 0), Icon: FolderKanban, color: colors.secondary },
    { label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}`, Icon: TrendingUp, color: colors.success },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <LayoutGrid size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.title}>Command Center</Text>
              <Text style={styles.subtitle}>Project Management Dashboard</Text>
            </View>
          </View>
        </View>

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search clients..."
            style={styles.searchBar}
          />
          <Button
            variant={showNoAgreement ? 'warning' : 'outline'}
            size="sm"
            onPress={() => setShowNoAgreement(!showNoAgreement)}
            icon={<Filter size={16} color={showNoAgreement ? colors.foreground : colors.foregroundMuted} />}
          >
            Filter
          </Button>
        </View>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <Button variant="outline" size="sm" onPress={onOutreachPress} style={styles.flex1}>
            <Megaphone size={16} color={colors.foreground} />
            <Text style={styles.buttonText}>OutReach Tracker</Text>
          </Button>
          <Button variant="default" size="sm" onPress={() => setAddClientOpen(true)} style={styles.flex1}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.buttonTextWhite}>New Client</Text>
          </Button>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }
      >
        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsRow}>
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} delay={i * 100} />
          ))}
        </Animated.View>

        {/* Overall Progress */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Overall Progress</Text>
              <Text style={styles.progressPercent}>{overallProgress}%</Text>
            </View>
            <ProgressBar progress={overallProgress} height={12} delay={500} />
          </GlassCard>
        </Animated.View>

        {/* Active Clients Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Clients</Text>
          <Text style={styles.sectionCount}>{filteredClients.length} clients</Text>
        </View>

        <View style={styles.clientGrid}>
          {filteredClients.map((client, index) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() => onClientPress(client.id)}
              index={index}
            />
          ))}
        </View>

        {filteredClients.length === 0 && (
          <GlassCard style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery || showNoAgreement 
                ? 'No clients match your filters.' 
                : 'No active clients at the moment.'
              }
            </Text>
          </GlassCard>
        )}

        {/* Completed Clients Section */}
        {completedClients.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Button
              variant="ghost"
              style={styles.completedToggle}
              onPress={() => setShowCompleted(!showCompleted)}
            >
              <CheckCircle2 size={20} color={colors.success} />
              <Text style={styles.completedTitle}>Completed Clients</Text>
              <Text style={styles.completedCount}>({completedClients.length})</Text>
              {showCompleted ? (
                <ChevronUp size={20} color={colors.foregroundMuted} />
              ) : (
                <ChevronDown size={20} color={colors.foregroundMuted} />
              )}
            </Button>

            {showCompleted && (
              <View style={styles.clientGrid}>
                {completedClients.map((client, index) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onPress={() => onClientPress(client.id)}
                    index={index}
                    isCompleted
                  />
                ))}
              </View>
            )}
          </Animated.View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <AddClientModal
        visible={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        onAdd={onAddClient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.foregroundMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  buttonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
  buttonTextWhite: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  progressCard: {
    marginTop: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.base,
    color: colors.foreground,
  },
  progressPercent: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'],
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.lg,
    color: colors.foreground,
  },
  sectionCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  clientGrid: {
    gap: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  completedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing['2xl'],
    paddingVertical: spacing.md,
  },
  completedTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.lg,
    color: colors.foreground,
  },
  completedCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
    marginRight: 'auto',
  },
  bottomPadding: {
    height: 100,
  },
});
```

### Client Card Component

```tsx
// components/dashboard/ClientCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  Building2, Mail, AlertTriangle, CheckCircle2, 
  ChevronRight, History, Sparkles 
} from 'lucide-react-native';
import { ClientWithProject } from '@/types/project';
import { Badge } from '@/components/ui/Badge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, typography, spacing } from '@/theme';

interface ClientCardProps {
  client: ClientWithProject;
  onPress: () => void;
  index: number;
  isCompleted?: boolean;
}

export function ClientCard({ client, onPress, index, isCompleted = false }: ClientCardProps) {
  const activeProject = client.projects[0];
  const isPending = client.agreement_status === 'Pending';
  const progress = activeProject?.progress ?? 0;
  const isComplete = progress === 100;
  const hasScopeCreep = activeProject?.requirements.some(r => r.is_additional_scope);

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(300)}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <GlassCard style={[styles.card, isCompleted && styles.completedCard]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.clientInfo}>
              <View style={[
                styles.iconContainer,
                isCompleted ? styles.iconCompleted : styles.iconActive
              ]}>
                {isCompleted ? (
                  <History size={24} color={colors.success} />
                ) : (
                  <Building2 size={24} color={colors.primary} />
                )}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View style={styles.emailRow}>
                  <Mail size={12} color={colors.foregroundMuted} />
                  <Text style={styles.email}>{client.email}</Text>
                </View>
              </View>
            </View>
            <ChevronRight size={20} color={colors.foregroundMuted} />
          </View>

          {/* Completed Badge */}
          {isCompleted && (
            <Badge variant="success" icon={<CheckCircle2 size={12} color={colors.success} />}>
              Completed
            </Badge>
          )}

          {/* Agreement Status */}
          {!isCompleted && (
            <View style={styles.statusRow}>
              {isPending ? (
                <Badge 
                  variant="destructive" 
                  icon={<AlertTriangle size={12} color={colors.destructive} />}
                >
                  Agreement Pending
                </Badge>
              ) : (
                <Badge 
                  variant="success" 
                  icon={<CheckCircle2 size={12} color={colors.success} />}
                >
                  Agreement Signed
                </Badge>
              )}
            </View>
          )}

          {/* Active Project */}
          {activeProject && (
            <View style={styles.projectSection}>
              <View style={styles.projectHeader}>
                <View style={styles.projectInfo}>
                  <PriorityBadge priority={activeProject.priority} />
                  <Text style={styles.projectName} numberOfLines={1}>
                    {activeProject.name}
                  </Text>
                </View>
                <Text style={[styles.progressText, isComplete && styles.progressComplete]}>
                  {progress}%
                </Text>
              </View>
              
              <ProgressBar 
                progress={progress} 
                delay={index * 100 + 300}
                isComplete={isComplete}
              />

              {/* Scope Creep Indicator */}
              {hasScopeCreep && (
                <Badge 
                  variant="scope" 
                  style={styles.scopeBadge}
                  icon={<Sparkles size={12} color={colors.warning} />}
                >
                  + New Scope Items
                </Badge>
              )}
            </View>
          )}

          {/* Completion indicator */}
          {isComplete && !isCompleted && (
            <View style={styles.completeDot} />
          )}
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  completedCard: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: colors.primaryMuted,
  },
  iconCompleted: {
    backgroundColor: colors.successBg,
  },
  textContainer: {
    flex: 1,
  },
  clientName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.base,
    color: colors.foreground,
    marginBottom: 2,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  email: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  projectSection: {
    gap: spacing.sm,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  projectName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
    flex: 1,
  },
  progressText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.foreground,
  },
  progressComplete: {
    color: colors.success,
  },
  scopeBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  completeDot: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
});
```

---

## 🏗️ WORKSPACE IMPLEMENTATION

### Client Workspace Screen

```tsx
// components/workspace/ClientWorkspace.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { 
  ArrowLeft, Building2, Calendar, AlertTriangle, 
  FileCheck, Plus, FolderOpen, Upload 
} from 'lucide-react-native';
import { ClientWithProject, TaskStatus, Subtask, Document, Priority, Requirement } from '@/types/project';
import { RequirementBoard } from './RequirementBoard';
import { DocumentManager } from './DocumentManager';
import { AddScopeModal } from './AddScopeModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, typography, spacing, shadows } from '@/theme';

interface ClientWorkspaceProps {
  client: ClientWithProject;
  onBack: () => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string, assignedTo?: string, priority?: Priority) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
  onAddRequirement?: (projectId: string, title: string, description: string, isAdditionalScope: boolean, priority?: Priority) => void;
  onDeleteRequirement?: (requirementId: string) => void;
  onUpdateRequirement?: (requirementId: string, updates: Partial<Requirement>) => void;
  onAddDocument?: (clientId: string, name: string, type: Document['type'], fileUrl: string) => void;
  onDeleteDocument?: (docId: string) => void;
}

export function ClientWorkspace({ 
  client, 
  onBack, 
  onTaskStatusChange, 
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onAddRequirement,
  onDeleteRequirement,
  onUpdateRequirement,
  onAddDocument,
  onDeleteDocument,
}: ClientWorkspaceProps) {
  const project = client.projects[0];
  const hasAgreement = client.documents?.some(d => d.type === 'agreement') ?? false;
  const isPending = !hasAgreement;
  const allRequirements = project?.requirements || [];

  const [docManagerOpen, setDocManagerOpen] = useState(false);
  const [addScopeOpen, setAddScopeOpen] = useState(false);

  const handleAddScope = (title: string, description: string, isAdditionalScope: boolean, priority: Priority) => {
    if (project && onAddRequirement) {
      onAddRequirement(project.id, title, description, isAdditionalScope, priority);
    }
  };

  return (
    <View style={styles.container}>
      {/* Warning Banner */}
      {isPending && (
        <Animated.View entering={SlideInRight.duration(300)} style={styles.warningBanner}>
          <View style={styles.warningContent}>
            <AlertTriangle size={16} color={colors.warning} />
            <Text style={styles.warningText}>Agreement Pending - Work at own risk</Text>
          </View>
          <Button 
            variant="warning" 
            size="sm" 
            onPress={() => setDocManagerOpen(true)}
            icon={<Upload size={14} color={colors.foreground} />}
          >
            Upload
          </Button>
        </Animated.View>
      )}

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          
          <View style={styles.clientHeader}>
            <View style={styles.clientIcon}>
              <Building2 size={24} color={colors.primary} />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              {project && (
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Badge variant={project.status === 'In Progress' ? 'info' : 'muted'}>
                    {project.status}
                  </Badge>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          {project && (
            <View style={styles.deadlineInfo}>
              <Calendar size={14} color={colors.foregroundMuted} />
              <Text style={styles.deadlineText}>
                Due: {new Date(project.deadline).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onPress={() => setDocManagerOpen(true)}
            icon={<FolderOpen size={16} color={colors.foreground} />}
          >
            Docs
          </Button>

          <Badge 
            variant={isPending ? 'destructive' : 'success'}
            icon={<FileCheck size={12} color={isPending ? colors.destructive : colors.success} />}
          >
            {isPending ? 'Pending' : 'Signed'}
          </Badge>

          <Button 
            variant="glow" 
            size="sm" 
            onPress={() => setAddScopeOpen(true)}
            icon={<Plus size={16} color="#FFFFFF" />}
          >
            Add Scope
          </Button>
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {project ? (
          <>
            {/* Progress Overview */}
            <Animated.View entering={FadeInDown.delay(200).duration(300)}>
              <GlassCard style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Project Progress</Text>
                  <Text style={styles.progressPercent}>{project.progress}%</Text>
                </View>
                <ProgressBar progress={project.progress} height={12} />
              </GlassCard>
            </Animated.View>

            {/* Requirements Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Project Scopes</Text>
            </View>

            {allRequirements.map((req, index) => (
              <Animated.View 
                key={req.id} 
                entering={FadeInDown.delay(300 + index * 100).duration(300)}
              >
                <RequirementBoard
                  requirement={req}
                  onTaskStatusChange={onTaskStatusChange}
                  onAddTask={onAddTask}
                  onDeleteTask={onDeleteTask}
                  onUpdateTask={onUpdateTask}
                  onDeleteRequirement={onDeleteRequirement}
                  onUpdateRequirement={onUpdateRequirement}
                />
              </Animated.View>
            ))}

            {allRequirements.length === 0 && (
              <GlassCard style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No scopes yet. Click "Add Scope" to create one.
                </Text>
              </GlassCard>
            )}
          </>
        ) : (
          <View style={styles.noProject}>
            <Text style={styles.noProjectText}>No active project found</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      <DocumentManager
        visible={docManagerOpen}
        onClose={() => setDocManagerOpen(false)}
        clientId={client.id}
        clientName={client.name}
        documents={client.documents || []}
        onAddDocument={onAddDocument}
        onDeleteDocument={onDeleteDocument}
      />

      <AddScopeModal
        visible={addScopeOpen}
        onClose={() => setAddScopeOpen(false)}
        onAdd={handleAddScope}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  warningBanner: {
    backgroundColor: colors.warningBg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  warningText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.warning,
  },
  header: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  clientIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.foreground,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  projectName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: 'auto',
  },
  deadlineText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  progressCard: {
    marginTop: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.base,
    color: colors.foreground,
  },
  progressPercent: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'],
    color: colors.primary,
  },
  sectionHeader: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.lg,
    color: colors.foreground,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
    textAlign: 'center',
  },
  noProject: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  noProjectText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.foregroundMuted,
  },
  bottomPadding: {
    height: 100,
  },
});
```

---

## 📦 KANBAN BOARD IMPLEMENTATION

### Note on Drag & Drop

For React Native drag-and-drop functionality, use `react-native-gesture-handler` and `react-native-reanimated`. The task cards can be long-pressed and dragged between columns.

```tsx
// components/workspace/KanbanColumn.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Subtask, TaskStatus } from '@/types/project';
import { TaskCard } from './TaskCard';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Subtask[];
  isAdditionalScope: boolean;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  'To Do': { label: 'To Do', color: colors.foregroundMuted, bgColor: colors.backgroundAlt },
  'In Progress': { label: 'In Progress', color: colors.info, bgColor: colors.infoBg },
  'Review': { label: 'Review', color: colors.warning, bgColor: colors.warningBg },
  'Done': { label: 'Done', color: colors.success, bgColor: colors.successBg },
};

export function KanbanColumn({ 
  status, 
  tasks, 
  isAdditionalScope,
  onDeleteTask,
  onUpdateTask,
}: KanbanColumnProps) {
  const config = statusConfig[status];

  return (
    <View style={styles.column}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.bgColor }]}>
        <Text style={[styles.headerText, { color: config.color }]}>{config.label}</Text>
        <View style={[styles.count, { backgroundColor: colors.card }]}>
          <Text style={[styles.countText, { color: config.color }]}>{tasks.length}</Text>
        </View>
      </View>

      {/* Tasks */}
      <View style={styles.taskList}>
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            isAdditionalScope={isAdditionalScope}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 280,
    marginRight: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  headerText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
  },
  count: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  countText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
  },
  taskList: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    padding: spacing.sm,
    minHeight: 200,
    gap: spacing.sm,
  },
});
```

---

## 📊 OUTREACH TRACKER IMPLEMENTATION

```tsx
// components/outreach/OutreachTracker.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { 
  ArrowLeft, Search, Plus, Edit2, Save, X, Trash2,
  Linkedin, Twitter, Mail, Link, ExternalLink,
  TrendingUp, Users, Target, CheckCircle2
} from 'lucide-react-native';
import { OutreachRecord, OutreachStatus, OUTREACH_STATUSES, STATUS_COLORS } from '@/types/outreach';
import { mockOutreachData } from '@/data/outreachData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { AddLeadModal } from './AddLeadModal';
import { ConfirmDialog } from '@/components/workspace/ConfirmDialog';
import { colors, typography, spacing } from '@/theme';

interface OutreachTrackerProps {
  onBack: () => void;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconProps = { size: 16, color: colors.foreground };
  switch (platform) {
    case 'LinkedIn': return <Linkedin {...iconProps} />;
    case 'Twitter': return <Twitter {...iconProps} />;
    case 'Email': return <Mail {...iconProps} />;
    default: return <Link {...iconProps} />;
  }
};

export function OutreachTracker({ onBack }: OutreachTrackerProps) {
  const [records, setRecords] = useState<OutreachRecord[]>(mockOutreachData);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter(r => 
      r.startupName.toLowerCase().includes(query) ||
      r.founder.toLowerCase().includes(query) ||
      r.techStack.toLowerCase().includes(query) ||
      r.status.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      contacted: records.filter(r => r.status !== 'Identified').length,
      inTalks: records.filter(r => r.status === 'In-Talks').length,
      converted: records.filter(r => r.status === 'Converted').length,
    };
  }, [records]);

  const handleAddRecord = (record: Omit<OutreachRecord, 'id'>) => {
    setRecords(prev => [{ ...record, id: `outreach-${Date.now()}` }, ...prev]);
  };

  const handleDeleteRecord = () => {
    if (recordToDelete) {
      setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      setRecordToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const openLink = (url: string) => {
    if (url.includes('@')) {
      Linking.openURL(`mailto:${url}`);
    } else if (url.startsWith('http')) {
      Linking.openURL(url);
    } else {
      Linking.openURL(`https://${url}`);
    }
  };

  const statItems = [
    { label: 'Total Leads', value: stats.total, Icon: Users, color: colors.primary },
    { label: 'Contacted', value: stats.contacted, Icon: Target, color: colors.info },
    { label: 'In Talks', value: stats.inTalks, Icon: TrendingUp, color: colors.warning },
    { label: 'Converted', value: stats.converted, Icon: CheckCircle2, color: colors.success },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>OutReach Tracker</Text>
            <Text style={styles.subtitle}>Track and manage your outreach campaigns</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.statsGrid}>
          {statItems.map((stat, i) => (
            <GlassCard key={stat.label} style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <stat.Icon size={24} color={stat.color} style={{ opacity: 0.8 }} />
            </GlassCard>
          ))}
        </Animated.View>

        {/* Search & Add */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by startup, founder..."
            style={styles.searchBar}
          />
          <Button 
            variant="default" 
            onPress={() => setAddModalOpen(true)}
            icon={<Plus size={16} color="#FFFFFF" />}
          >
            Add Lead
          </Button>
        </View>

        {/* Records List */}
        {filteredRecords.map((record, index) => (
          <Animated.View 
            key={record.id} 
            entering={FadeInDown.delay(200 + index * 50).duration(300)}
          >
            <GlassCard style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={styles.recordInfo}>
                  <Badge 
                    style={{ backgroundColor: STATUS_COLORS[record.status].bg }}
                  >
                    <Text style={{ color: STATUS_COLORS[record.status].text }}>
                      {record.status}
                    </Text>
                  </Badge>
                  <Text style={styles.startupName}>{record.startupName}</Text>
                </View>
                <View style={styles.recordActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      setRecordToDelete(record.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.recordDetails}>
                <Text style={styles.founderName}>{record.founder}</Text>
                <Text style={styles.techStack}>{record.techStack}</Text>
              </View>

              <View style={styles.recordMeta}>
                <Badge variant="muted">{record.problemType}</Badge>
                
                {record.contactLink && (
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => openLink(record.contactLink)}
                  >
                    <PlatformIcon platform={record.contactPlatform} />
                    <Text style={styles.linkText}>{record.contactPlatform}</Text>
                  </TouchableOpacity>
                )}

                {record.auditLink && (
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => openLink(record.auditLink)}
                  >
                    <ExternalLink size={14} color={colors.primary} />
                    <Text style={[styles.linkText, { color: colors.primary }]}>Audit</Text>
                  </TouchableOpacity>
                )}
              </View>

              {record.specificIssue && (
                <Text style={styles.issueText} numberOfLines={2}>
                  {record.specificIssue}
                </Text>
              )}

              <View style={styles.recordFooter}>
                <Text style={styles.dateText}>
                  {record.outreachDate || 'No date set'}
                </Text>
                <Text style={styles.nextAction}>
                  {record.nextAction || 'No action set'}
                </Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        {filteredRecords.length === 0 && (
          <GlassCard style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No leads match your search' : 'No leads yet. Add your first lead!'}
            </Text>
          </GlassCard>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <AddLeadModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddRecord}
      />

      <ConfirmDialog
        visible={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        onConfirm={handleDeleteRecord}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.foreground,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statContent: {},
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.foregroundMuted,
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'],
    color: colors.foreground,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flex: 1,
  },
  recordCard: {
    marginBottom: spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  startupName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.base,
    color: colors.foreground,
  },
  recordActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
  recordDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  founderName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.foreground,
  },
  techStack: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 6,
  },
  linkText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
    color: colors.foreground,
  },
  issueText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
    marginBottom: spacing.sm,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  nextAction: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.foreground,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.foregroundMuted,
  },
  bottomPadding: {
    height: 100,
  },
});
```

---

## 🪝 HOOK IMPLEMENTATION

### useProjectData Hook

```typescript
// hooks/useProjectData.ts
import { useState, useCallback, useMemo } from 'react';
import { mockClients, mockProjects, mockRequirements, mockSubtasks, mockDocuments } from '@/data/mockData';
import { 
  Client, Project, Requirement, Subtask, Document, 
  ClientWithProject, ProjectWithProgress, RequirementWithTasks, 
  TaskStatus, Priority, PRIORITY_ORDER 
} from '@/types/project';

export function useProjectData() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  const calculateProgress = useCallback((tasks: Subtask[]): number => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'Done').length;
    return Math.round((completed / tasks.length) * 100);
  }, []);

  const sortByPriority = useCallback(<T extends { priority: Priority }>(items: T[]): T[] => {
    return [...items].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }, []);

  const getRequirementWithTasks = useCallback((req: Requirement): RequirementWithTasks => {
    const reqSubtasks = subtasks
      .filter(t => t.requirement_id === req.id)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    return { ...req, subtasks: reqSubtasks };
  }, [subtasks]);

  const getProjectWithProgress = useCallback((project: Project): ProjectWithProgress => {
    const projectReqs = requirements
      .filter(r => r.project_id === project.id)
      .map(getRequirementWithTasks)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    
    const allTasks = projectReqs.flatMap(r => r.subtasks);
    const progress = calculateProgress(allTasks);
    
    return { ...project, requirements: projectReqs, progress };
  }, [requirements, getRequirementWithTasks, calculateProgress]);

  const clientsWithProjects = useMemo((): ClientWithProject[] => {
    return clients
      .filter(c => c.status === 'Active')
      .map(client => {
        const clientProjects = projects
          .filter(p => p.client_id === client.id)
          .map(getProjectWithProgress)
          .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        
        const clientDocs = documents.filter(d => d.client_id === client.id);
        
        return { ...client, projects: clientProjects, documents: clientDocs };
      });
  }, [clients, projects, documents, getProjectWithProgress]);

  const completedClients = useMemo((): ClientWithProject[] => {
    return clients
      .filter(c => c.status === 'Completed')
      .map(client => {
        const clientProjects = projects
          .filter(p => p.client_id === client.id)
          .map(getProjectWithProgress)
          .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        
        const clientDocs = documents.filter(d => d.client_id === client.id);
        
        return { ...client, projects: clientProjects, documents: clientDocs };
      });
  }, [clients, projects, documents, getProjectWithProgress]);

  const getClientById = useCallback((clientId: string): ClientWithProject | undefined => {
    return [...clientsWithProjects, ...completedClients].find(c => c.id === clientId);
  }, [clientsWithProjects, completedClients]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setSubtasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  }, []);

  const addSubtask = useCallback((requirementId: string, title: string, assignedTo?: string, priority: Priority = 'Medium') => {
    const newTask: Subtask = {
      id: `task-${Date.now()}`,
      requirement_id: requirementId,
      title,
      status: 'To Do',
      priority,
      assigned_to: assignedTo,
      created_at: new Date().toISOString().split('T')[0],
    };
    setSubtasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const deleteSubtask = useCallback((taskId: string) => {
    setSubtasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const updateSubtask = useCallback((taskId: string, updates: Partial<Subtask>) => {
    setSubtasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const addRequirement = useCallback((projectId: string, title: string, description: string, isAdditionalScope: boolean, priority: Priority = 'Medium') => {
    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      project_id: projectId,
      title,
      description,
      is_additional_scope: isAdditionalScope,
      priority,
      created_at: new Date().toISOString().split('T')[0],
    };
    setRequirements(prev => [...prev, newReq]);
    return newReq;
  }, []);

  const deleteRequirement = useCallback((requirementId: string) => {
    setRequirements(prev => prev.filter(r => r.id !== requirementId));
    setSubtasks(prev => prev.filter(t => t.requirement_id !== requirementId));
  }, []);

  const updateRequirement = useCallback((requirementId: string, updates: Partial<Requirement>) => {
    setRequirements(prev => prev.map(req =>
      req.id === requirementId ? { ...req, ...updates } : req
    ));
  }, []);

  const addClient = useCallback((name: string, email: string, projectName: string, projectPriority: Priority) => {
    const clientId = `client-${Date.now()}`;
    const projectId = `project-${Date.now()}`;
    
    const newClient: Client = {
      id: clientId,
      name,
      email,
      status: 'Active',
      agreement_status: 'Pending',
      created_at: new Date().toISOString().split('T')[0],
    };
    
    const newProject: Project = {
      id: projectId,
      client_id: clientId,
      name: projectName,
      status: 'Planning',
      priority: projectPriority,
      start_date: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0],
    };
    
    setClients(prev => [...prev, newClient]);
    setProjects(prev => [...prev, newProject]);
    
    return { client: newClient, project: newProject };
  }, []);

  const checkAndUpdateClientStatus = useCallback((clientId: string) => {
    const clientProjects = projects.filter(p => p.client_id === clientId);
    const projectIds = clientProjects.map(p => p.id);
    const clientReqs = requirements.filter(r => projectIds.includes(r.project_id));
    const reqIds = clientReqs.map(r => r.id);
    const clientTasks = subtasks.filter(t => reqIds.includes(t.requirement_id));
    
    const client = clients.find(c => c.id === clientId);
    if (!client || clientTasks.length === 0) return;
    
    const allTasksDone = clientTasks.every(t => t.status === 'Done');
    const hasIncompleteTasks = clientTasks.some(t => t.status !== 'Done');
    
    if (allTasksDone && client.status === 'Active') {
      setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, status: 'Completed' } : c
      ));
    } else if (hasIncompleteTasks && client.status === 'Completed') {
      setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, status: 'Active' } : c
      ));
    }
  }, [clients, projects, requirements, subtasks]);

  const addDocument = useCallback((clientId: string, name: string, type: Document['type'], fileUrl: string) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      client_id: clientId,
      name,
      type,
      file_url: fileUrl,
      uploaded_at: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [...prev, newDoc]);
    
    if (type === 'agreement') {
      setClients(prev => prev.map(c =>
        c.id === clientId ? { ...c, agreement_status: 'Signed', agreement_url: fileUrl } : c
      ));
    }
    
    return newDoc;
  }, []);

  const deleteDocument = useCallback((docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    
    if (doc?.type === 'agreement') {
      const remainingAgreements = documents.filter(d => 
        d.client_id === doc.client_id && d.type === 'agreement' && d.id !== docId
      );
      if (remainingAgreements.length === 0) {
        setClients(prev => prev.map(c =>
          c.id === doc.client_id ? { ...c, agreement_status: 'Pending', agreement_url: undefined } : c
        ));
      }
    }
  }, [documents]);

  return {
    clientsWithProjects,
    completedClients,
    getClientById,
    updateTaskStatus,
    addSubtask,
    deleteSubtask,
    updateSubtask,
    addRequirement,
    deleteRequirement,
    updateRequirement,
    addClient,
    checkAndUpdateClientStatus,
    addDocument,
    deleteDocument,
  };
}
```

---

## 📱 EXPO ROUTER SETUP

### Root Layout

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="workspace/[clientId]" />
        <Stack.Screen name="outreach" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
```

---

## 📦 DEPENDENCIES TO INSTALL

```bash
npx expo install expo-router expo-font @expo-google-fonts/manrope
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install react-native-safe-area-context react-native-screens
npx expo install expo-linear-gradient expo-document-picker expo-file-system
npm install lucide-react-native
```

---

## 🎯 KEY IMPLEMENTATION NOTES

### 1. Animation Library
Use `react-native-reanimated` for all animations. The web version uses Framer Motion, which translates to:
- `FadeIn`, `FadeInDown`, `SlideInRight` entering animations
- `withTiming`, `withSpring` for value animations
- `useAnimatedStyle` for animated styles

### 2. Drag and Drop
For the Kanban board, implement drag-and-drop using:
- `react-native-gesture-handler` for gesture detection
- `react-native-reanimated` for smooth animations
- Long-press to activate drag mode

### 3. Navigation
Use Expo Router for navigation between:
- Dashboard (index)
- Client Workspace (workspace/[clientId])
- Outreach Tracker (outreach)

### 4. State Management
The `useProjectData` hook manages all application state. For production, consider:
- React Query for server state
- Zustand for client state
- AsyncStorage for persistence

### 5. Responsive Design
All components should work on both phone and tablet. Key breakpoints:
- Phone: Single column layouts
- Tablet: Multi-column grids, side-by-side panels

### 6. Light Theme
This implementation uses a LIGHT theme with CYAN accents. All colors are defined in `theme/colors.ts` and should be used consistently throughout.

---

## ✅ CHECKLIST FOR IMPLEMENTATION

- [ ] Set up Expo project with TypeScript
- [ ] Install all dependencies
- [ ] Configure fonts (Manrope)
- [ ] Create theme system (colors, typography, spacing)
- [ ] Implement base UI components (Button, Badge, Card, etc.)
- [ ] Implement Dashboard screen with stats and client list
- [ ] Implement Client Workspace with Kanban board
- [ ] Implement Outreach Tracker with lead management
- [ ] Add all modals (AddClient, AddScope, DocumentManager)
- [ ] Implement drag-and-drop for Kanban
- [ ] Add toast notifications
- [ ] Test on iOS and Android
- [ ] Optimize performance with memoization

---

## 🔄 AUTO-COMPLETION STATUS

When all tasks in a project are marked as "Done":
1. The client automatically moves to "Completed Clients" section
2. If new scope is added to a completed client, they move back to "Active Clients"
3. This logic is handled in `checkAndUpdateClientStatus` function

---

This prompt provides complete context for recreating the UpCraft CRM interface in React Native. The AI should follow the exact component structures, styling patterns, and functional behaviors described above.
