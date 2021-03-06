let categories = [
  {
    name: "Animals",
    subs: ["Aquatic", "Livestock", "Pets", "Terrestrial", "Wildlife"]
  },
  {
    name: "Sports",
    subs: [
      "Olympics",
      "Paralympics",
      "Soccer",
      "Basketball",
      "Tennis",
      "Formula 1",
      "Rugby",
      "Cycling",
      "Horse Racing",
      "Golf",
      "Swimming",
      "Athletics",
      "Boxing",
      "Baseball",
      "Cricket",
      "Ice Hockey",
      "Field Hockey",
      "MotoGp",
      "Wrestling",
      "Gymnastics",
      "Table Tennis",
      "Horse Racing",
      "Snooker",
      "Badminton",
      "American Football",
      "MMA",
      "Handball",
      "Skiing"
    ]
  },
  {
    name: "Movies",
    subs: [
      "Action",
      "Comedy",
      "Horror",
      "Musical",
      "Romance",
      "Sci-Fi",
      "Thriller/Suspense",
      "Drama",
      "Adventure",
      "Documentary",
      "Black Comedy",
      "Western",
      "Romantic Comedy",
      "Reality",
      "Multiple Genres",
      "Fantasy"
    ]
  },
  {
    name: "Music",
    subs: [
      "Pop",
      "Jazz",
      "Classical",
      "Folk",
      "Soul/Blues",
      "Rock",
      "Country",
      "Reggae",
      "Hip-hop/Rap",
      "Orchestra",
      "Heavy metal",
      "Opera",
      "Gospel",
      "Acoustic",
      "African"
    ]
  },
  {
    name: "Books",
    subs: [
      "Children's Fiction",
      "Fantasy",
      "Mystery",
      "Classic Literary Fiction",
      "Modern Literary Fiction",
      "Historical Fiction",
      "Young Adult Fiction",
      "Romance",
      "Memoir",
      "Biography",
      "Narrative",
      "Religion/Spirituality",
      "Science",
      "History",
      "Health/Fitness",
      "Business/Finance"
    ]
  },
  {
    name: "Education",
    subs: [
      "Early childhood",
      "Primary",
      "Secondary",
      "Vocational",
      "Masters",
      "Doctorate",
      "Highschool",
      "College",
      "University"
    ]
  },
  {
    name: "Occupation",
    subs: [
      "Agriculture",
      "Architecture",
      "Audio/Video tech",
      "Business management/Admin",
      "Education and Training",
      "Finance",
      "Government and Public admin",
      "Health Science",
      "Hospitality and Tourism",
      "Human Services",
      "Information Technology",
      "Law, Public safety, Security",
      "Manufacturing",
      "Marketing, Sales and Service",
      "Science, Technology, Engineering",
      "Transportation, and Logistics"
    ]
  },
  {
    name: "Science",
    subs: [
      "Astronomy",
      "Physics",
      "Biology",
      "Botany",
      "Chemical Engineering",
      "Chemistry",
      "Computer Science",
      "Engineering",
      "Environmental Science",
      "Psychology",
      "Anatomy",
      "Medicine",
      "Paleontology"
    ]
  },
  {
    name: "Games",
    subs: [
      "Action",
      "Action-adventure",
      "Adventure",
      "Role-playing",
      "Simulation",
      "Strategy",
      "Sports",
      "Puzzle",
      "Idle"
    ]
  },
  {
    name: "People",
    subs: [
      "Sportsperson",
      "Polititcian",
      "Philosopher",
      "Psychologist",
      "Celebrity",
      "Scientist",
      "Entertainer",
      "Public Figure"
    ]
  },
  {
    name: "Television",
    subs: [
      "News",
      "Documentary",
      "Soap",
      "Cartoon",
      "Kids",
      "Drama",
      "Sitcom",
      "Makeover",
      "Reality",
      "Sports"
    ]
  },
  {
    name: "Entertainment",
    subs: [
      "Sports",
      "Attractions",
      "Museums",
      "Cultural Events",
      "Performance Art",
      "Games",
      "Arts/Exhibitions"
    ]
  },

  {
    name: "Lifestyle",
    subs: [
      "Activist",
      "Ascetic",
      "Primitive",
      "Bohemian",
      "Nudist",
      "Communist",
      "Groupie",
      "Hippie",
      "Nomadist",
      "Socialite",
      "Rural",
      "Academic",
      "Technician",
      "Creative",
      "Corporate"
    ]
  },
  {
    name: "Food",
    subs: [
      "Vegetables",
      "Fruits",
      "Grains, Beans, & Nuts",
      "Meat & Poultry",
      "Fish & Seafood",
      "Dairy Foods"
    ]
  },
  {
    name: "Drinks",
    subs: [
      "Beer",
      "Wine",
      "Cider",
      "Cocktail",
      "Hard Alcohol",
      "Water",
      "Milk",
      "Tea",
      "Coffee",
      "Soft drinks",
      "Juice",
      "Mocktail",
      "Energy drinks",
      "Smoothies",
      "Tonic Water"
    ]
  },
  {
    name: "Health & Fitness",
    subs: ["Cardio", "Strength", "Body Composition", "Flexibility", "Endurance"]
  },
  {
    name: "Fashion",
    subs: [
      "Goth",
      "Classic",
      "Casual",
      "Office wear",
      "Sports wear",
      "Exotic",
      "Street",
      "Vintage",
      "Chic",
      "Arty",
      "Preppy",
      "Bohemian",
      "Flamboyant",
      "Punk",
      "Rocker",
      "Tomboy",
      "Grunge"
    ]
  }
];

export default categories.sort((a, b) => {
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
});

// {
//   name: "Companies and Products",
//   subs: [
//     "Google",
//     "Apple",
//     "Amazon",
//     "Facebook",
//     "Netflix",
//     "Nike",
//     "Microsoft",
//     "Tesla",
//     "Disney",
//     "Coca-Cola",
//     "Spotify",
//     "Adidas",
//     "Buzzfeed",
//     "Starbucks",
//     "FedEx",
//     "Walmart"
//   ]
// }

// categories to remember: Fashion, Food & Drinks, Environment, Recreation & Hobbies, Health & Fitness, Information
