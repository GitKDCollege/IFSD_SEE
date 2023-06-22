import React, { useState } from "react";
import WidgetWrapper from "components/WidgetWrapper";

class City {
  constructor(name) {
    this.name = name;
  }
}

class Leg {
  constructor(cityA, cityB, cost) {
    this.cityA = cityA;
    this.cityB = cityB;
    this.cost = cost;
  }
}

class Route {
  constructor() {
    this.legs = [];
  }

  addLeg(leg) {
    this.legs.push(leg);
  }

  removeLeg(index) {
    this.legs.splice(index, 1);
  }

  updateLegCost(index, newCost) {
    this.legs[index].cost = newCost;
  }

  calculateTotalCost() {
    let totalCost = 0;
    for (let i = 0; i < this.legs.length; i++) {
      totalCost += this.legs[i].cost;
    }
    return totalCost;
  }
}

function RouteW() {
  const [route, setRoute] = useState(new Route());
  const [cityA, setCityA] = useState("");
  const [cityB, setCityB] = useState("");
  const [cost, setCost] = useState(0);
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [newCost, setNewCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const addLeg = () => {
    const cityAObj = new City(cityA);
    const cityBObj = new City(cityB);
    const leg = new Leg(cityAObj, cityBObj, cost);
    route.addLeg(leg);
    setCityA("");
    setCityB("");
    setCost(0);
    setTotalCost(route.calculateTotalCost());
  };

  const removeLeg = (index) => {
    route.removeLeg(index);
    setTotalCost(route.calculateTotalCost());
  };

  const setLegToUpdate = (index) => {
    setUpdateIndex(index);
    setNewCost(route.legs[index].cost);
  };

  const updateLegCost = () => {
    route.updateLegCost(updateIndex, newCost);
    setUpdateIndex(-1);
    setNewCost(0);
    setTotalCost(route.calculateTotalCost());
  };

  return (
    <WidgetWrapper>
    <div>
      <h2>Route</h2>
      <div>
        <label>City A:</label>
        <input
          type="text"
          value={cityA}
          onChange={(e) => setCityA(e.target.value)}
        />
      </div>
      <div>
        <label>City B:</label>
        <input
          type="text"
          value={cityB}
          onChange={(e) => setCityB(e.target.value)}
        />
      </div>
      <div>
        <label>Cost:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value))}
        />
      </div>
      <button onClick={addLeg}>Add Leg</button>

      <h3>Legs</h3>
      <ul>
        {route.legs.map((leg, index) => (
          <li key={index}>
            {leg.cityA.name} - {leg.cityB.name} (Cost: {leg.cost})
            <button onClick={() => removeLeg(index)}>Remove</button>
            {updateIndex === index ? (
              <>
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(parseInt(e.target.value))}
                />
                <button onClick={updateLegCost}>Update Cost</button>
              </>
            ) : (
              <button onClick={() => setLegToUpdate(index)}>Update Cost</button>
            )}
          </li>
        ))}
      </ul>

      <h3>Total Cost</h3>
      <p>{totalCost}</p>
    </div>
    </WidgetWrapper>
  );
}

export default RouteW;
