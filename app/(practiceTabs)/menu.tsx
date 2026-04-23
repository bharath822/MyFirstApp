import { router } from 'expo-router'
import { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

type Welcome = {
        recipes: Recipe[];
        total:   number;
        skip:    number;
        limit:   number;
    }

    type Recipe = {
        id:                 number;
        name:               string;
        ingredients:        string[];
        instructions:       string[];
        prepTimeMinutes:    number;
        cookTimeMinutes:    number;
        servings:           number;
        difficulty:         Difficulty;
        cuisine:            string;
        caloriesPerServing: number;
        tags:               string[];
        userId:             number;
        image:              string;
        rating:             number;
        reviewCount:        number;
        mealType:           string[];
    }

    enum Difficulty {
        Easy = "Easy",
        Medium = "Medium",
    }

export default function MenuScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)    
    useEffect(() => {
        fetchRecipes()
    }, [])
    const fetchRecipes = async () => {
        try {
            const response = await fetch('https://dummyjson.com/recipes')
            const data = await response.json()
            setRecipes(data.recipes)
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
    return (
        <View style={styles.screenContainer}>
        <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                          onPress={() => router.push(`/recipies/${item.id}`)}                        
                        >
                 <View style={styles.card}>
                    <Text style={styles.RecipeName}>{item.name}</Text>
                    <Image style={styles.RecipeImage} source={{ uri: item.image }} />
                </View>
                </TouchableOpacity>
            )}
        />
        </View>
    )
    

}



const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 10,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    RecipeName:{
        fontSize: 18,
        fontWeight: "bold",
        color: '#153a13',
    },
    RecipeImage: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginTop: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    screenContainer: {
        paddingTop: 26,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});