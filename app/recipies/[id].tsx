import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type recipes = {
        id:                 number;
        name:               string;
        ingredients:        string[];
        instructions:       string[];
        prepTimeMinutes:    number;
        cookTimeMinutes:    number;
        servings:           number;
        cuisine:            string;
        caloriesPerServing: number;
        tags:               string[];
        userId:             number;
        image:              string;
        rating:             number;
        reviewCount:        number;
        mealType:           string[];
    }
import { Link, useLocalSearchParams } from 'expo-router'

export default function RecipeDetailScreen() {
    const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams()  // reads ID from URL
    const [recipes, setRecipe] = useState<recipes | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchRecipe()
    }, [])
    const fetchRecipe = async () => {
        try {
            const response = await fetch(`https://dummyjson.com/recipes/${id}`)
            const data = await response.json()
            setRecipe(data)
            setLoading(false)
        }
        catch (error) {
            console.log('Error:', error)
            setLoading(false)
        }
    }
    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }
    if (!recipes) {
        return (
            <View style={styles.container}>
                <Text>Recipe not found</Text>
            </View>
        )
    }
    return (
        <ScrollView
         contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        style={styles.screenContainer}>
            <Text style={styles.RecipeName}>{recipes.name}</Text>
            <Image style={styles.RecipeImage} source={{ uri: recipes.image }} />
            <Text style={styles.RecipeDetails}>Cuisine: {recipes.cuisine}</Text>
            <Text style={styles.RecipeDetails}>Prep Time: {recipes.prepTimeMinutes} mins</Text>
            <Text style={styles.RecipeDetails}>Cook Time: {recipes.cookTimeMinutes} mins</Text>
            <Text style={styles.RecipeDetails}>Servings: {recipes.servings}</Text>
            <Text style={styles.RecipeDetails}>Calories per Serving: {recipes.caloriesPerServing}</Text>
            <Text style={styles.RecipeDetails}>Rating: {recipes.rating} ({recipes.reviewCount} reviews)</Text>
            <Text style={styles.RecipeDetails}>Ingredients:</Text>
            {recipes.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.IngredientItem}>- {ingredient}</Text>
            ))}
            <Text style={styles.RecipeDetails}>Instructions:</Text>
            {recipes.instructions.map((instruction, index) => (
                <Text key={index} style={styles.InstructionItem}>{index + 1}. {instruction}</Text>       
            ))}
            <Link href="/">
              <Text style={{ color: 'blue', fontSize: 18 }}>Home</Text>
            </Link>
            <Link href="/menu">
              <Text style={{ color: 'blue', fontSize: 18 }}>back toMenu</Text>
            </Link>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    RecipeName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    RecipeImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    RecipeDetails: {
        fontSize: 16,
        marginBottom: 5,
    },
    IngredientItem: {
        fontSize: 14,
        marginLeft: 10,
    },
    InstructionItem: {
        fontSize: 14,
        marginBottom: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
