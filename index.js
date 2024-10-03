import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.themealdb.com/api/json/v1/1/";

const test = {
  meals: [
    {
      idMeal: "53042",
      strMeal: "Portuguese prego with green piri-piri",
      strDrinkAlternate: null,
      strCategory: "Beef",
      strArea: "Portuguese",
      strInstructions:
        "STEP 1\r\n\r\nRub the garlic over the steaks then put in a sandwich bag and tip in the olive oil, sherry vinegar and parsley stalks. Smoosh everything together, then use a rolling pin to bash the steaks a few times. Leave for 1-2 hours.\r\n\r\nSTEP 2\r\n\r\nTo make the sauce, put all the ingredients into a blender with 1 tbsp water and whizz until as smooth as possible. This will make more than you’ll need for the recipe but will keep for a week in an airtight jar.\r\n\r\nSTEP 3\r\n\r\nHeat a griddle or frying pan to high. Brush away the garlic and parsley stalks from the steaks and season well. Sear the steaks for 2 minutes on each side then rest on a plate. Put the ciabatta halves onto the plate, toasted-side down, to soak up any juices.\r\n\r\nSTEP 4\r\n\r\nSlice the steaks then stuff into the rolls with the green sauce and rocket.",
      strMealThumb:
        "https://www.themealdb.com/images/media/meals/ewcikl1614348364.jpg",
      strTags: null,
      strYoutube: "https://www.youtube.com/watch?v=FbIKfcDEPLA",
      strIngredient1: "Garlic",
      strIngredient2: "Beef Fillet",
      strIngredient3: "Olive Oil",
      strIngredient4: "Vinegar",
      strIngredient5: "Parsley",
      strIngredient6: "Ciabatta",
      strIngredient7: "Rocket",
      strIngredient8: "Basil Leaves",
      strIngredient9: "Parsley",
      strIngredient10: "Jalapeno",
      strIngredient11: "Vinegar",
      strIngredient12: "Spring Onions",
      strIngredient13: "Garlic",
      strIngredient14: "Caster Sugar",
      strIngredient15: "",
      strIngredient16: "",
      strIngredient17: "",
      strIngredient18: "",
      strIngredient19: "",
      strIngredient20: "",
      strMeasure1: "1 clove",
      strMeasure2: "2 small",
      strMeasure3: "2 tbs",
      strMeasure4: "1 tbs",
      strMeasure5: "Leaves",
      strMeasure6: "2",
      strMeasure7: "2 handfulls",
      strMeasure8: "Small bunch",
      strMeasure9: "Small bunch",
      strMeasure10: "1",
      strMeasure11: "1 tbs",
      strMeasure12: "2 chopped",
      strMeasure13: "1/2 ",
      strMeasure14: "1/2 tsp",
      strMeasure15: " ",
      strMeasure16: " ",
      strMeasure17: " ",
      strMeasure18: " ",
      strMeasure19: " ",
      strMeasure20: " ",
      strSource:
        "https://www.olivemagazine.com/recipes/meat-and-poultry/portuguese-prego-with-green-piri-piri/",
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    },
  ],
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function makeArray(mealArray, meal, start, stop) {
  //Make the elements of the object into an array which is returned
  let arr = Object.values(meal);

  //To use for both ingredients and measurments we provide a start and stop value.
  for (let i = start; i < stop; i++) {
    if (arr[i] && arr[i] != " ") {
      mealArray.push(arr[i]);
    }
  }
  return mealArray;
}

// GET Home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// GET random recipie
app.get("/random", async (req, res) => {
  try {
    // Find random meal and present it
    const meal = (await axios.get(API_URL + "random.php")).data.meals[0];

    let mealName = meal.strMeal;
    let mealImage = meal.strMealThumb;
    let mealInstructions = meal.strInstructions;
    let mealIngredients = [];
    let mealMeasures = [];

    mealIngredients = makeArray(mealIngredients, meal, 9, 29);
    mealMeasures = makeArray(mealMeasures, meal, 29, 49);

    // Render recipie with all information about meal
    res.render("recipe.ejs", {
      mealName: mealName,
      mealImage: mealImage,
      mealIngredients: mealIngredients,
      mealMeasures: mealMeasures,
      mealInstructions: mealInstructions,
    });
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

// GET recipie by filter
app.post("/filter", async (req, res) => {
  try {
    // Filter returns list of objects(meals) that satisfy the filter
    const meals = (await axios.get(API_URL + "filter.php?c=" + req.body.filter))
      .data.meals;

    // Chose a random meal that satisfies the filter
    const mealInfo = meals[Math.floor(Math.random() * meals.length)];

    //Find meal by ID
    const meal = (await axios.get(API_URL + "lookup.php?i=" + mealInfo.idMeal))
      .data.meals[0];

    let mealName = meal.strMeal;
    let mealImage = meal.strMealThumb;
    let mealInstructions = meal.strInstructions;
    let mealIngredients = [];
    let mealMeasures = [];

    mealIngredients = makeArray(mealIngredients, meal, 9, 29);
    mealMeasures = makeArray(mealMeasures, meal, 29, 49);

    res.render("recipe.ejs", {
      mealName: mealName,
      mealImage: mealImage,
      mealIngredients: mealIngredients,
      mealMeasures: mealMeasures,
      mealInstructions: mealInstructions,
    });
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

// Error message
app.get("/:universalURL", (req, res) => {
  res.render("error.ejs");
});

// RUN SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
