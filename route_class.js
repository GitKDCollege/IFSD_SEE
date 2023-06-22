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

function main()
{
    let r1 = new Route();
    r1.input_no_of_legs();
    r1.populate_route();
    r1.total_cost();
}

main();