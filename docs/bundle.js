

function run1D() {
  console.log("Running 1D Simulation");

  // Get the variables from the form
  const bT = parseFloat(document.getElementById("bT").value);
  const bsT = parseFloat(document.getElementById("bsT").value);
  const kappa = parseFloat(document.getElementById("kappa").value);
  const length = parseFloat(document.getElementById("length").value);
  const timeout = parseFloat(document.getElementById("timeout").value);
  const dt = parseFloat(document.getElementById("dt").value);
  const tol = parseFloat(document.getElementById("tol").value);

  console.log("Boundary Temperature:", bT);
  console.log("Kappa:", kappa);
  console.log("1D Length:", length);
  console.log("dt:", dt)

  // Set up the discretised region and initial conditions
  const numberOfNodes = 50.0;
  const dx = length / (numberOfNodes - 1);
  console.log("dx:", dx);
  const dx2 = dx**2;
  console.log("dx2:", dx2)

  let ncT = new Array(numberOfNodes).fill(bsT);
  let nnT = new Array(numberOfNodes).fill(0);

  ncT[0] = bT;
  ncT[ncT.length-1] = bT;
  nnT[0] = bT;
  nnT[nnT.length-1] = bT;

  console.log(ncT);
  // https://www.jstips.co/en/javascript/array-average-and-median/
  let sum = ncT.reduce((previous, current) => current += previous);
  let avg = sum / ncT.length;
  let diff = Math.abs(bT - avg);

  let t = 0.0;
  let bTLine = [[t, bT]]
  let midpointLine = [[t, bsT]];

  while (diff > tol) {

    // increment the time
    t += dt;

    // If the simulation is going beyond what we might be thinking (potentially not converging)
    if (t >= timeout) {
      alert("Simulation Timeout")
      break;
    }

    // iterate through the domain and update the values for the new timestep
    for (i = 1; i < numberOfNodes - 1; i++) {
      let numerator = ncT[i-1] - 2 * ncT[i] + ncT[i+1];
      let dT = kappa * dt * (numerator / dx2);
      nnT[i] = ncT[i] + dT;
    }

    // get the average difference to the boundary temperature
    ncT = nnT;
    sum = ncT.reduce((previous, current) => current += previous);
    avg = sum / ncT.length;
    diff = Math.abs(bT - avg);

    // update midpoint data
    midpointLine.push([t, ncT[24]])
  }

  // update the boundary line for the chart
  bTLine.push([t, bT])
  
  console.log(ncT);
  // Set the convergence time
  document.getElementById("convTime").value = t;

  // Update the mid-point converge
  convChart.series[0].setData(bTLine, true);
  convChart.series[1].setData(midpointLine, true);

  // Create the line for the distribution chart
  let distLine = [];
  for (i = 0; i < numberOfNodes; i++) {
    distLine.push([i*dx, ncT[i]])
  }
  distChart.series[0].setData(distLine, true);

};

// Setting up the charts
let convChart = Highcharts.chart("convChart", {
  title: {
    text: 'Temperature at Mid-Point'
  },

  yAxis: {
    title: {
      text: 'Temperature (°C)'
    }
  },

  xAxis: {
    title: {
      text: 'Time (s)'
    }
  },

  series: [
    {
      name: "Boundary Condition",
      data: [[]]
    },
    {
      name: 'Mid-Point',
      data: [[]]
    }
  ]
});

let distChart = Highcharts.chart("distChart", {
  title: {
    text: 'Temperature Distribution'
  },

  yAxis: {
    title: {
      text: 'Temperature (°C)'
    }
  },

  xAxis: {
    title: {
      text: 'Position (m)'
    }
  },

  series: [
    {
      name: "Boundary Condition",
      data: []
    }
  ]
});