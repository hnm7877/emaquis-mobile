import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { getProfile, updateProfile } from "../services/auth";
import { useAuthStore } from "../utils/authStore";

export default function ProfileScreen() {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone: "",
    country: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProfile(token);
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          telephone: data.telephone || "",
          country: data.country || "",
        });
      } catch (e) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await updateProfile(form, token);
      setEditing(false);
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (e) {
      setError("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil gestionnaire</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
        placeholder="Nom"
        editable={editing}
      />
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
        placeholder="Email"
        editable={editing}
      />
      <TextInput
        style={styles.input}
        value={form.telephone}
        onChangeText={(v) => setForm((f) => ({ ...f, telephone: v }))}
        placeholder="Téléphone"
        editable={editing}
      />
      <TextInput
        style={styles.input}
        value={form.country}
        onChangeText={(v) => setForm((f) => ({ ...f, country: v }))}
        placeholder="Pays"
        editable={editing}
      />
      {editing ? (
        <Button title="Enregistrer" onPress={handleSave} />
      ) : (
        <Button title="Modifier" onPress={() => setEditing(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF8F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8F0",
  },
});
