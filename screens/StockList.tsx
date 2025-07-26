import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Button,
  Alert,
  TextInput,
} from "react-native";
import {
  fetchProducts,
  deleteProduct,
  fetchProductsByCategory,
} from "../services/product";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

type Product = {
  _id?: string;
  id?: string;
  name?: string;
  quantity?: number;
  stock?: number;
  categorie?: { name?: string } | string;
  price?: number;
  available?: boolean;
};

export default function StockListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigation = useNavigation();

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProducts();
      setProducts(data);
      setAllProducts(data);
    } catch (e) {
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Recherche dynamique
  useEffect(() => {
    let filtered = allProducts;
    if (search) {
      filtered = filtered.filter((p: Product) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(
        (p: Product) =>
          (typeof p.categorie === "object" && p.categorie !== null
            ? p.categorie.name
            : p.categorie
          )?.toLowerCase() === category.toLowerCase()
      );
    }
    setProducts(filtered);
  }, [search, category, allProducts]);

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmation", "Supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            setProducts((prev: Product[]) =>
              prev.filter((p: Product) => p._id !== id && p.id !== id)
            );
            setAllProducts((prev: Product[]) =>
              prev.filter((p: Product) => p._id !== id && p.id !== id)
            );
            Alert.alert("Succès", "Produit supprimé");
          } catch (e) {
            Alert.alert("Erreur", "Impossible de supprimer le produit");
          }
        },
      },
    ]);
  };

  const handleEdit = (item: Product) => {
    (navigation as any).navigate("ProductForm", { product: item });
  };

  // Extraire les catégories uniques pour le filtre
  const categories = Array.from(
    new Set(
      allProducts
        .map((p: Product) =>
          typeof p.categorie === "object" && p.categorie !== null
            ? p.categorie.name
            : p.categorie
        )
        .filter(Boolean)
    )
  );

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
    <View style={{ flex: 1 }}>
      <View style={styles.searchFilterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={search}
          onChangeText={setSearch}
        />
        <Picker
          selectedValue={category || ""}
          style={styles.picker}
          onValueChange={(itemValue: any) => setCategory(itemValue)}
        >
          <Picker.Item label="Toutes catégories" value="" />
          {categories.map((cat) => (
            <Picker.Item
              key={String(cat ?? "")}
              label={String(cat ?? "")}
              value={String(cat ?? "")}
            />
          ))}
        </Picker>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Quantité : {item.quantity ?? item.stock ?? "-"}</Text>
            <Text>
              Catégorie :{" "}
              {typeof item.categorie === "object" && item.categorie !== null
                ? item.categorie.name
                : item.categorie || "-"}
            </Text>
            <Text>Prix : {item.price ? `${item.price} FCFA` : "-"}</Text>
            <Text>Disponible : {item.available ? "Oui" : "Non"}</Text>
            <View style={styles.actions}>
              <Button
                title="Modifier"
                color="#FFB300"
                onPress={() => handleEdit(item)}
              />
              <Button
                title="Supprimer"
                color="#FF3B30"
                onPress={() => handleDelete(item._id || item.id || "")}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8F0",
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  picker: {
    width: 160,
    height: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    color: "#FF6B00",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
});
