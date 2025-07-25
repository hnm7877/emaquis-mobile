import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { createProduct, updateProduct } from "../services/product";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function ProductFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const editingProduct = (route.params as any)?.product;

  const [name, setName] = useState(editingProduct?.name || "");
  const [quantity, setQuantity] = useState(
    editingProduct?.quantity?.toString() || ""
  );
  const [price, setPrice] = useState(editingProduct?.price?.toString() || "");
  const [categorie, setCategorie] = useState(editingProduct?.categorie || "");
  const [session, setSession] = useState(editingProduct?.session || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setQuantity(editingProduct.quantity?.toString() || "");
      setPrice(editingProduct.price?.toString() || "");
      setCategorie(editingProduct.categorie || "");
      setSession(editingProduct.session || "");
    }
  }, [editingProduct]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const data = {
        name,
        quantity: Number(quantity),
        price: Number(price),
        categorie,
        session,
      };
      if (editingProduct && (editingProduct._id || editingProduct.id)) {
        await updateProduct(editingProduct._id || editingProduct.id, data);
        Alert.alert("Succès", "Produit modifié avec succès !");
      } else {
        await createProduct(data);
        Alert.alert("Succès", "Produit ajouté avec succès !");
      }
      setSuccess(true);
      navigation.goBack();
    } catch (e) {
      setError((e as string) || "Erreur lors de l'enregistrement du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingProduct ? "Modifier" : "Ajouter"} un produit
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du produit"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Prix (FCFA)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Catégorie"
        value={categorie}
        onChangeText={setCategorie}
      />
      <TextInput
        style={styles.input}
        placeholder="Session (ObjectId)"
        value={session}
        onChangeText={setSession}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? (
        <Text style={styles.success}>Produit enregistré avec succès !</Text>
      ) : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button
          title={editingProduct ? "Enregistrer les modifications" : "Ajouter"}
          onPress={handleSubmit}
        />
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
    marginBottom: 12,
  },
  success: {
    color: "green",
    marginBottom: 12,
  },
});
