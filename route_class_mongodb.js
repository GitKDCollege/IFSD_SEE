const prompt = require('prompt-sync')();

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

async function reading_data()
{
    result = await collection.find().toArray();
    return result;
}

async function updating_data()
{
    let id = Number(prompt("Select ID of the Leg: "));
    let revisedcost = prompt("Enter the Revised Cost of the Leg: ");
    await collection.updateOne({LegID:id},{$set:{Cost:revisedcost}});
    await console.log("Updated the Record")
    result = await collection.find({LegID:id}).toArray();
    await console.log(result);
}

async function deleting_data()
{
    let id = Number(prompt("Select ID of the Leg: "));
    await collection.deleteOne({LegID:id});
    await console.log("Deleted Record")
}

async function find_total()
{
    a=await reading_data();
    let total=0
    for(let i=0;i<a.length;i++)
    {
        total+=a[i]['Cost'];
    }
    console.log("The Total Cost is : ",total);
}

function main()
{
    let r1 = new Route();
    r1.input_no_of_legs();
    r1.populate_route();
    inserting_data(r1);
    // r1.total_cost();
}

main();