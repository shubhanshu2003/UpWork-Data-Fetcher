
document.getElementById('fetchData').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    await chrome.tabs.sendMessage(tab.id, { message: "start" });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const storedData = await chrome.storage.local.get('extractedProfiles');
    console.log(storedData)
    if (storedData) {
        // Convert the JSON data to CSV
        const csvContent = convertToCSV(storedData.extractedProfiles);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        console.log(url)
        
        let downloadLink = document.getElementsByClassName('in_d')[0];

        downloadLink.href = window.URL.createObjectURL(blob);;
        downloadLink.download = 'profiles.csv';
        downloadLink.dataset.downloadurl = ['text/csv', downloadLink.download, downloadLink.href].join(':');
        
        // Enable the download button
        const downloadButton = document.getElementById('downloadData');
        downloadButton.disabled = false;

        // // Set up the click event to trigger the download
        downloadButton.addEventListener('click', () => {
            downloadLink.click(); // Programmatically click the hidden download link
            URL.revokeObjectURL(url); // Clean up the object URL after download
        });

        console.log('Data is ready for download as profiles.csv');
    } else {
        console.log("No profiles found in localStorage.");
    }
});

// Function to convert JSON to CSV
function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    const header = Object.keys(array[0]).join(',') + '\r\n';
    const rows = array.map(obj => Object.values(obj).join(',')).join('\r\n');
    return header + rows;
}
