let images;

images = {
  books: {
    creator: {
      name: "Alfons Morales",
      link:
        "https://unsplash.com/@alfonsmc10?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/images/things/book?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  music: {
    creator: {
      name: "James Stamler",
      link:
        "https://unsplash.com/@jamesstamler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  education: {
    creator: {
      name: "Vasily Koloda",
      link:
        "https://unsplash.com/@napr0tiv?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/education?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  science: {
    creator: {
      name: "Ousa Chea",
      link:
        "https://unsplash.com/@cheaousa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/science-lab?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  games: {
    creator: {
      name: "Caspar Camille Rubin",
      link:
        "https://unsplash.com/@casparrubin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/games?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  occupation: {
    creator: {
      name: "Bruce Mars",
      link:
        "https://unsplash.com/@brucemars?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/occupation?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  movies: {
    creator: {
      name: "Krists Luhaers",
      link:
        "https://unsplash.com/@kristsll?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/movie?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  sports: {
    creator: {
      name: "Tim Gouw",
      link:
        "https://unsplash.com/@punttim?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/sports?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  lifestyle: {
    creator: {
      name: "Willian Justen de Vasconcellos",
      link:
        "https://unsplash.com/@willianjusten?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/lifestyle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  television: {
    creator: {
      name: "Glenn Carstens-Peter",
      link:
        "https://unsplash.com/@glenncarstenspeters?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/television?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  miscellaneous: {
    creator: {
      name: "Ignat Kushanrev",
      link:
        "https://unsplash.com/@ignatkushanrev?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/collection?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  animals: {
    creator: {
      name: "Harald Hofer",
      link:
        "https://unsplash.com/@numen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/images/animals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  food: {
    creator: {
      name: "Randy Fath",
      link:
        "https://unsplash.com/@randyfath?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/food-photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  drinks: {
    creator: {
      name: "Kaizen Nguyen",
      link:
        "https://unsplash.com/@kaizennguyen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/drinks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  fashion: {
    creator: {
      name: "freestocks.org",
      link:
        "https://unsplash.com/@freestocks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/fashion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  health_fitness: {
    creator: {
      name: "Mr Lee",
      link:
        "https://unsplash.com/@mrleecanburn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/fitness?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  entertainment: {
    creator: {
      name: "Aditya Chinchure",
      link:
        "https://unsplash.com/@adityachinchure?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/entertainment?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  people: {
    creator: {
      name: "Tobi Oluremi",
      link:
        "https://unsplash.com/@_olusion_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    },
    imageLink:
      "https://unsplash.com/s/photos/politician?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  }
};

export default images;
