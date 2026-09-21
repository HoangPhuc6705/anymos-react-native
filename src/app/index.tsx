import {
  Button,
  Input,
  InputGroup
} from "@/components/ui";
import { AppText } from "@/components/ui/AppText";
import { Palette, Spacing } from "@/constants/themes";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { UserOutline, LockOutline, EyeOutline, EyeClosedOutline } from 'solar-icon-set'

export default function Index() {


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText>
        Đăng nhập
      </AppText>
      <InputGroup
        leadingIcon={<UserOutline />}
        placeholder="John Doe"
        label="Username" />
      <InputGroup
        leadingIcon={<LockOutline />}
        trailingIcon={<EyeClosedOutline />}
        label="Password" />
      <Button
        title="Đăng nhập"
      />
      <Button title="Tiếp tục với Google" variant="outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingTop: 54,
    paddingBottom: 40,
    backgroundColor: Palette.grey[50],
    gap: Spacing.md
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Palette.grey[950],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Palette.grey[500],
    marginBottom: 20,
  },
  card: {
    backgroundColor: Palette.white,
    padding: Spacing.lg,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.grey[200],
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.grey[900],
    marginBottom: 6,
  },
  sectionCaption: {
    fontSize: 13,
    color: Palette.grey[500],
    marginBottom: 16,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  columnGap: {
    gap: 14,
  },
  iconPlaceholder: {
    fontSize: 14,
  },
});
