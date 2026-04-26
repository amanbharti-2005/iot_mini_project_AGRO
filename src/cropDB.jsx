const cropDB = {

  strawberry: {
    care: "🍓 Needs mulch, drip irrigation, partial sun.",
    profit: 3,
    market: "High demand in urban markets. ₹180–250/kg",
    diseases: [
      { name:"Gray Mold", img:"https://i.imgur.com/PhR8K9R.jpg", fix:"Improve airflow + remove infected fruit" }
    ]
  },

  mushroom:{
    care:"🍄 Grow in shade, compost substrate, high humidity.",
    profit:2.5,
    market:"Hotels + restaurants demand. ₹200–400/kg",
    diseases:[
      {name:"Green Mold",img:"https://i.imgur.com/dDqf7x6.jpg",fix:"Replace substrate"}
    ]
  },

  blueberry:{
    care:"🫐 Acidic soil + full sun.",
    profit:3.5,
    market:"Premium fruit export. ₹600–900/kg",
    diseases:[
      {name:"Root Rot",img:"https://i.imgur.com/s0Gnh9X.jpg",fix:"Improve drainage"}
    ]
  },

  dragonfruit:{
    care:"🐉 Cactus soil + poles support.",
    profit:4,
    market:"Fast growing market. ₹120–250/kg",
    diseases:[
      {name:"Stem Rot",img:"https://i.imgur.com/hH6gRkM.jpg",fix:"Cut damaged parts"}
    ]
  },

  fiddleleaf:{
    care:"Large leaves, bright indirect light, water only when soil dry.",
    profit:1.2,
    market:"Interior decor plant ₹800–3000/pot",
    diseases:[{name:"Root Rot",img:"https://i.imgur.com/hH6gRkM.jpg",fix:"Reduce watering"}]
  },

  orchid:{
    care:"Weekly soaking, orchid fertilizer, indirect light.",
    profit:1.8,
    market:"Flower market ₹150–600/plant",
    diseases:[{name:"Fungal Rot",img:"https://i.imgur.com/w9GkW4V.jpg",fix:"Improve airflow"}]
  },

  bonsai:{
    care:"Direct light, pruning, seasonal repotting.",
    profit:2,
    market:"Decorative sales ₹1500–8000/tree",
    diseases:[{name:"Root Drying",img:"https://i.imgur.com/s0Gnh9X.jpg",fix:"Maintain moisture"}]
  },

  hibiscus:{
    care:"Full sun, potassium fertilizer.",
    profit:1.6,
    market:"Flower vendors ₹60–150/plant",
    diseases:[{name:"Aphids",img:"https://i.imgur.com/YQz3FQf.jpg",fix:"Neem spray"}]
  },

  jasmine:{
    care:"Full sun, moist soil.",
    profit:1.7,
    market:"Perfume + garland ₹200–400/kg",
    diseases:[{name:"Leaf Spot",img:"https://i.imgur.com/w9GkW4V.jpg",fix:"Copper spray"}]
  },

  peacelily:{
    care:"Low light, regular watering.",
    profit:1.3,
    market:"Indoor decor ₹400–1200",
    diseases:[{name:"Yellow Leaves",img:"https://i.imgur.com/YQz3FQf.jpg",fix:"Reduce watering"}]
  }

};