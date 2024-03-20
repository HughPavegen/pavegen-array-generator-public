// renderer.js
const widthSlider = document.getElementById('widthSlider');
const widthInput = document.getElementById('widthInput');
const lengthSlider = document.getElementById('lengthSlider');
const lengthInput = document.getElementById('lengthInput');
const gridContainer = document.getElementById('gridContainer');
//const downloadButton = document.getElementById('downloadButton');

// Set the initial grid
updateGrid();

// Event listeners for the sliders
widthSlider.oninput = () => {
  let widthValue = Math.max(2, widthSlider.value); // Ensure width is at least 2
  widthSlider.value = widthValue; // Correct the slider position if needed
  widthInput.value = widthValue;
  updateGrid();
};

lengthSlider.oninput = () => {
  let lengthValue = Math.max(2, lengthSlider.value); // Ensure length is at least 1
  lengthSlider.value = lengthValue; // Correct the slider position if needed
  lengthInput.value = (lengthValue * 0.5).toFixed(1); // Convert to increments of 0.5
  updateGrid();
};

// Event listeners for the text inputs
widthInput.onchange = () => {
  let widthValue = Math.max(2, widthInput.value); // Ensure width is at least 2
  widthInput.value = widthValue; // Correct the input value if needed
  widthSlider.value = widthValue;
  updateGrid();
};

lengthInput.onchange = () => {
  let lengthValue = Math.max(1, parseFloat(lengthInput.value)); // Ensure length is at least 0.5
  lengthValue = (Math.round(lengthValue * 2) / 2).toFixed(1); // Round to nearest 0.5
  lengthInput.value = lengthValue; // Set the corrected value back to the input
  lengthSlider.value = lengthValue * 2; // Adjust the slider value
  updateGrid();
};

function updateGrid() {
  const width = parseInt(widthInput.value, 10); // Parse the width as an integer
  const length = parseFloat(lengthInput.value) * 2; // Convert length input to tile units, rounding to nearest 0.5

  gridContainer.innerHTML = ''; // Clear existing grid
  
  for (let y = 0; y < width; y++) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    
    for (let x = 0; x < length; x++) {
      const img = document.createElement('img');
      img.src = './assets/half-tile-instance.png';
      img.width = 50; // Width of a single tile, unchanged
      img.height = 86; // Height of a single tile, unchanged
      // Apply transformations
      img.style.transform = `scaleX(${x % 2 === 0 ? 1 : -1}) scaleY(${y % 2 === 0 ? 1 : -1})`;
      img.style.objectFit = 'cover';
      row.appendChild(img);
    }
    gridContainer.appendChild(row);
  }

  // Now call updateTable and pass the current length and width
  updateTable(length, width);
}

/*function calculateEvenOddSeams(width) {
  if (width < 2) {
    return {evenSeams: 0, oddSeams:0};//no seams if less than 2 tile width
  }
  const evenSeams = Math.floor(width/2);
  const oddSeams = Math.floor((width-1)/2);
  return {evenSeams, oddSeams}
}
*/

// The updateTable function now accepts length and width as parameters
function updateTable(length, width) {
  // The calculations for length in meters and width in meters need to be corrected
  // to use the actual dimensions of the tiles if known.
  const tilesLong = length/2;
  const tilesWide = width;
  const lengthM = length * (0.5/2) + 0.05; // Assuming each tile length unit is 0.5 meters
  const widthM = width * 0.433 + 0.05; // Assuming each tile width unit is 1 meter
  const areaM2 = lengthM * widthM; // Area calculation
  const numGenerators = (Math.floor((tilesWide-1)/2))*(Math.floor(tilesLong - 0.5))+(Math.floor((tilesWide)/2))*(Math.floor(tilesLong)); // Your calculation here
  const fullTiles = (tilesWide*((tilesLong*2)-1)); // Your calculation here
  const halfTiles = tilesWide*2; // Your calculation here

  // Update the table cells with the calculated values
  document.getElementById('tilesLong').innerText = tilesLong;
  document.getElementById('tilesWide').innerText = tilesWide;
  document.getElementById('lengthM').innerText = lengthM.toFixed(2);
  document.getElementById('widthM').innerText = widthM.toFixed(2);
  document.getElementById('areaM2').innerText = areaM2.toFixed(2);
  document.getElementById('numGenerators').innerText = numGenerators;
  document.getElementById('fullTiles').innerText = fullTiles;
  document.getElementById('halfTiles').innerText = halfTiles;
}

 
document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', () => {
    console.log('Download button clicked, capturing gridContainer');
    if (window.html2canvasAPI) {
      window.html2canvasAPI.takeScreenshot('#gridContainer').then(dataUrl => {
        // Now you have a dataUrl that you can send to the main process or download directly
        console.log(dataUrl);
        // If you want to send it to the main process, use the ipcRenderer.send method
        window.electronAPI.send('save-capture', dataUrl);
      }).catch(error => {
        console.error('Error taking screenshot:', error);
      });
    } else {
      console.error('html2canvasAPI is not available');
    }
  });
});

  // renderer.js

  
const html2canvas = require('html2canvas'); // If using CommonJS modules

const captureDiv = document.getElementById('divToCapture');
const downloadButton = document.getElementById('downloadButton');

downloadButton.addEventListener('click', () => {
  html2canvas(captureDiv).then((canvas) => {
    // Convert the canvas to blob
    canvas.toBlob((blob) => {
      // Now you can send this blob to the main process to save as a file
      // Or you can trigger a download directly from the renderer process
      const fileReader = new FileReader();
      fileReader.onload = function () {
        // Convert blob to base64 for the Electron main process
        const base64Data = this.result;
        if (window.electronAPI) {
          window.electronAPI.send('save-capture', base64Data);
        } else {
          console.error('electronAPI is not available');
        }
      };
      fileReader.readAsDataURL(blob);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('capture-btn').addEventListener('click', () => {
    // Assume 'capture-btn' is the ID of your button
    // and 'target-div' is the ID of the div you want to capture
    window.api.captureScreen('gridContaineriv');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', () => {
    window.html2canvasAPI.takeScreenshot('#divToCapture').then(dataUrl => {
      // Now you have a dataUrl that you can send to the main process or download directly
      console.log(dataUrl);
      // If you want to send it to the main process, use the ipcRenderer.send method
    });
  });
});





