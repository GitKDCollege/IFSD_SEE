const express = require('express');
const prompt = require('prompt-sync')();

const app = express();
const port = 3000;

class City
{
    constructor()
    {
        this.name;
    }
    input_city(i)
    {
        this.name=prompt(`Enter the Name of the City ${i}: `);
    }
}

class Leg
{
    static continuer;
    static id=1;
    constructor()
    {
        this.city1=new City();
        this.city2=new City();
        this.cost;
        this.id = Leg.id;
    }
    input_leg(i)
    {
        console.log(`For Leg - ${this.id}`)
        if(i==1)
        {
            this.city1.input_city(i);
            this.city2.input_city(i+1);
        }
        else
        {
            console.log(`City ${i} is ${Leg.continuer}`);
            this.city1.name=Leg.continuer;
            this.city2.input_city(i+1);
        }
        this.cost=Number(prompt(`Enter the Cost of Leg - ${this.id}: `))
        Leg.continuer=this.city2.name
        Leg.id += 1;
    }
}

class Route
{
    constructor()
    {
        this.legs=[];
        this.n;
    }
    input_no_of_legs()
    {
        this.n=Number(prompt("Enter the Number of Legs in the Route: "));
    }
    populate_route()
    {
        for(let i=0;i<this.n;i++)
        {
            this.legs[i]=new Leg();
            this.legs[i].input_leg(i+1);
        }
    }
    total_cost()
    {
        let total=0;
        for(let i=0;i<this.n;i++)
        {
            total += this.legs[i].cost;
        }
        console.log(`Total Cost for the Route with ${this.n} Legs and ${this.n+1} Cities is ${total}`);
    }
}

const {MongoClient} = require('mongodb');
url="mongodb+srv://kishor:kishor@cluster0.ntpbcte.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

const database = client.db('Routes');
// database.createCollection('student');
const collection = database.collection('Legs');
console.log("Connected to Database");

async function inserting_data(nclass)
{
    data=[]
    for(let i=0;i<nclass.n;i++)
    {
        data.push({LegID:nclass.legs[i].id,Cities:{City1:nclass.legs[i].city1.name,City2:nclass.legs[i].city2.name},Cost:nclass.legs[i].cost});
    }
    result = await collection.insertMany(data);
    await console.log("Inserted the Data");
}

// POST - Create 'n' new Routes
app.post('/createroutes', async (req, res) => {
    try{
        let r = new Route();
        r.input_no_of_legs();
        r.populate_route();
        inserting_data(r);
        res.status(201).json({status:'Entered Data Successfully'});
    }
    catch{
        res.status(404).json({error:'Cannot Insert Data'});
    }
  res.status(201).json();
});

// GET - Get all Routes
app.get('/getlegs', async (req, res) => {
    result = await collection.find().toArray();
    res.json(result);
});

// GET - Get a specific Leg by ID
app.get('/getleg/id', async (req, res) => {
    const id = Number(prompt('Enter the ID of the Leg: '));
  const result = await collection.findOne({LegID:id});
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Leg not found' });
  }
});

// PUT - Update a Leg by ID
app.put('/updatecost/id', async (req, res) => {
    const id = Number(prompt("Enter the ID of the Leg: "));
  const cost = Number(prompt('Enter the Updated Cost of the Leg: '));

  const result = await collection.updateOne(
    {LegID:id},
    { $set: {Cost:cost} }
  );

  if (result.matchedCount > 0) {
    const updatedPlayer = await collection.findOne({ID:id});
    res.json(updatedPlayer);
  } else {
    res.status(404).json({ error: 'Leg not found' });
  }
});

// DELETE - Delete a player by ID
app.delete('/deleteleg/id', async (req, res) => {
    const id = Number(prompt("Enter the ID of the Leg: "));
  const result = await collection.deleteOne({LegID:id});
  if (result.deletedCount > 0) {
    res.status(204).json({status:'Deleted the Leg'});
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});