const download = function (data) {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute("download", "download.csv");

  // Performing a download with click
  a.click();
};

const video = document.getElementById("qr-video");
const videoContainer = document.getElementById("video-container");
// const camHasCamera = document.getElementById('cam-has-camera');
const camList = document.getElementById("cam-list");
const camHasFlash = document.getElementById("cam-has-flash");
const flashToggle = document.getElementById("flash-toggle");
const flashState = document.getElementById("flash-state");
const camQrResult = document.getElementById("cam-qr-result");
const fileSelector = document.getElementById("file-selector");
const fileQrResult = document.getElementById("file-qr-result");

// this will serve as our collator
localStorage["csv"] = JSON.stringify({});

function ce(text, color) {
  var p = document.createElement("p");
  let log = document.getElementById("log");
  p.style.color = color;
  p.textContent = text;
  log.appendChild(p);
  document.getElementById("loggs").appendChild(log);
}

document.getElementById("clear_log").addEventListener(
  "click",
  (event) => {
    document.getElementById("loggs").innerHTML = "";
  },
  false
);

function setResult(label, result) {
  console.log(result.data);
  ce(result.data, "blue");

  // make sure its a TSCI QR code
  if (result.data.includes("thestandingchurch")) {
    let tag_no = result.data.split("_")[1];

    fetch(
      "/cowboy_proxy.php?url=https://api.buylink.app/users/record&tag=" +
        tag_no,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    ).then((reslt) => {
      reslt.json().then((res) => {
        let uniq = res.response.unique;
        let tag = document.getElementById("tag_num");

        tag.style.display = "block";

        if (uniq) ce(`Tag number detected: ${tag_no}`, "green");
        else ce(`Error: Duplicate Entry!`, "red");

        setTimeout(() => (tag.style.display = "none"), 2000);
      });
    });
  }
}

// ###### Web Cam Scanning #######

const scanner = new QrScanner(
  video,
  (result) => setResult(camQrResult, result),
  {
    onDecodeError: (error) => {
      camQrResult.textContent = error;
      camQrResult.style.color = "inherit";
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
  }
);

const updateFlashAvailability = () => {
  scanner.hasFlash().then((hasFlash) => {
    camHasFlash.textContent = hasFlash;
    flashToggle.style.display = hasFlash ? "inline-block" : "none";
  });
};

scanner.start().then(() => {
  updateFlashAvailability();
  QrScanner.listCameras(true).then((cameras) =>
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.id;
      option.text = camera.label;
      camList.add(option);
    })
  );
});

// QrScanner.hasCamera().then(hasCamera => camHasCamera.textContent = hasCamera);

// for debugging
window.scanner = scanner;

document
  .getElementById("scan-region-highlight-style-select")
  .addEventListener("change", (e) => {
    videoContainer.className = e.target.value;
    scanner._updateOverlay(); // reposition the highlight because style 2 sets position: relative
  });

document.getElementById("show-scan-region").addEventListener("change", (e) => {
  const input = e.target;
  const label = input.parentNode;
  label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
  scanner.$canvas.style.display = input.checked ? "block" : "none";
});

document
  .getElementById("inversion-mode-select")
  .addEventListener("change", (event) => {
    scanner.setInversionMode(event.target.value);
  });

camList.addEventListener("change", (event) => {
  scanner.setCamera(event.target.value).then(updateFlashAvailability);
});

flashToggle.addEventListener("click", () => {
  scanner
    .toggleFlash()
    .then(() => (flashState.textContent = scanner.isFlashOn() ? "on" : "off"));
});

document.getElementById("start-button").addEventListener("click", () => {
  scanner.start();
});

document.getElementById("stop-button").addEventListener("click", () => {
  scanner.stop();
});

// document.getElementById('download_csv').addEventListener('click', () => {
//     const csvString = [
//         [
//             "Tag Number",
//             "Date-Time"
//         ],
//             ...Object.values(JSON.parse(localStorage["csv"])).map(item => [
//             item.tag,
//             item.date_time
//         ])
//     ].map(e => e.join(","))
//     .join("\n");

//     download(csvString);
// });
