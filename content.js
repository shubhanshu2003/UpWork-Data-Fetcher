

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {     
  if (request.message === "start") {
      const elements = document.getElementsByClassName("air3-card-section air3-card-hover");
      const length = elements.length;
      let extractedData = []; // Array to hold all profile data
      let count = 0;
      (async function processCards() {
        while(count<1 ){
          for (let i = 0; i < length -6; i++) {
              elements[i].click();
              if(i == 0){
                  await new Promise(resolve => setTimeout(resolve, 3500)); // Wait for the page to load

              }else{
                  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for the page to load

              }

              try {
                  let name = document.querySelector(".d-inline.vertical-align-middle.m-0.h2")?.innerText || "N/A";

                  let title1 = document.querySelector(".mb-0.pt-lg-2x.h4")?.innerText || "N/A";
                  let title=`"${title1.replace(/"/g, '""')}"`;

                  let des = document.querySelector(".text-body.text-pre-line.break")?.innerText || "N/A";
                  let description=`"${des?.replace(/"/g, '""')}"`;
                  

                  let url = (window.location.href).slice(37,57);
                  let URL=`https://www.upwork.com/freelancer/~${url}`;

                  let price = document.querySelector(".d-inline.h5.nowrap")?.innerText || "N/A";

                  // Select the success rate element safely
                  let success = document.querySelector('.air3-progress-circle')?.innerText?.slice(0, 3) || "N/A";
                  
                  // Select the liked element safely
                  let liked ;
                  let slc_len = document.querySelectorAll("[data-test='SaveDropdown SaveButton']").length;
                  let slc = document.querySelectorAll("[data-test='SaveDropdown SaveButton']")[slc_len-1].innerText.slice(0,5);
                  liked = (slc == "Saved")?true:false;
  
                  // Store the extracted data in an object
                  let profileData = { name, title, description, URL, price, success, liked };
                  extractedData.push(profileData); // Add to the array
                  
                  console.log(profileData);

                  // Return to the previous page
                  document.querySelector(".m-0.p-0.air3-btn.air3-btn-link.d-none.d-md-block")?.click();
              } catch (error) {
                  console.error("Error processing card:", error);
              }
              
              await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before processing the next card
            }
            document.getElementsByClassName("air3-pagination-next-btn air3-btn air3-btn-circle air3-btn-tertiary")[0].click();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before processing the next card
          count++;
        }
          
          // Store the array of extracted data in chrome.storage.local as JSON
          chrome.storage.local.set({ 'extractedProfiles': extractedData });

          console.log("Data stored in chrome.storage.local as JSON:", extractedData);
          
          sendResponse({ farewell: "goodbye" });
      })();
      
      // Necessary to indicate asynchronous response
      return true;
  }
});



