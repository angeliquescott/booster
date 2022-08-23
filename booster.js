// Initialize button with users's prefered color
let togglePassword = document.getElementById("togglePassword");
let emailAddress = document.getElementsByName("login_email");
let password = document.getElementsByName("password");
let forgotPassword = document.getElementById("forgot-password-container").getElementsByTagName("a");
let loginButton = document.getElementById("loginButton");
let returnToLogin = document.getElementById("return-to-login-container").getElementsByTagName("a");
let sendRecoveryLinkButton = document.getElementById("sendRecoveryLinkButton");
let searchButton = document.getElementById("searchButton");
let newButton = document.getElementById("newButton");
let marketingButton = document.getElementById("marketingButton");

let logOutLink = document.getElementsByClassName("banner");
let logoutButton1 = logOutLink[0].getElementsByTagName("a")[0];
let logoutButton2 = logOutLink[1].getElementsByTagName("a")[0];
let logoutButton3 = logOutLink[2].getElementsByTagName("a")[0];
let logoutButton4 = logOutLink[3].getElementsByTagName("a")[0];

let backButtonContent = document.getElementsByClassName("content");
let backButton1 = backButtonContent[1].getElementsByTagName("a")[0];
let backButton2 = backButtonContent[2].getElementsByTagName("a")[0];
let backButton3 = backButtonContent[3].getElementsByTagName("a")[0];

let editDetailsLink = document.getElementById("editDetails");

let returnToDashboardBoosterButton = document.getElementById("returnToDashboardBoosterButton");
let returnToDashboardApplicationButton = document.getElementById("returnToDashboardApplicationButton");

let changeColor = document.getElementById("changeColor");
let checkButton = document.getElementById("checkButton");
let getLeadButton = document.getElementById("getLead");
let getBoosterButton = document.getElementById("getBooster");

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let contactNumber = document.getElementById("contactNumber");
let email = document.getElementById("emailAddress");
let propertyType = document.getElementById("propertyType");
let fullAddress = document.getElementById("fullAddress");
let startDate = document.getElementById("startDate");
let lowPriceRange = document.getElementById("lowPriceRange");
let highPriceRange = document.getElementById("highPriceRange");

let calculateButton = document.getElementById("calculateButton");

let propertyOwnerPaysCheckbox = document.getElementById("propertyOwnerPays");
let listingAgencyPaysCheckbox = document.getElementById("listingAgentPays");

let noFeeProposalButton = document.getElementById("createProposalNoFeeButton");
let feeProposalButton = document.getElementById("createProposalFeeButton");

let partnerPortalLink = document.getElementById("partnerPortalLink");

let proposedCommissionRate = document.getElementById("proposedCommissionRate");

let keys = [];

let mapLookup = document.getElementById("fullAddress");
let addressResults = document.getElementById("addressResults");

// let trybtn = document.getElementById("trybtn");
// trybtn.addEventListener("click", async function () {  
   
// });

// document.addEventListener('DOMContentLoaded', function () {  
//   // document.getElementById("window-login-container").style.display = "block";
//   chrome.storage.local.get(["lastCheckedVer"], function(data) {  
//     const day = new Date().getDate();
//     console.log("day:" + day + " data:" + data.lastCheckedVer);
//     if (data.lastCheckedVer != day ) {      
//       console.log("data <> day");     
//       getVersion();    
//     } else {
//       var manifestData = chrome.runtime.getManifest();
//       document.getElementById("versionLabel").innerHTML = `ver ${manifestData.version}`;
//       loadlast();
//     }   
//   });
// });

async function getVersion() {
  var manifestData = chrome.runtime.getManifest();
  let warningWindow = document.getElementById("window-versionwarning-container");
  let headersList = { "Accept": "*/*", "Content-Type": "application/json" };
  const day = new Date().getDate();
  const response = await fetch("https://stage.elepay.com.au/front/chr_version", { method: "GET", headers: headersList });

  if (!response.ok) {
    console.log("getVersion(): " + response);
    document.getElementById("versionwarning-message").innerHTML = `Version Error: ${response.status}`;
    warningWindow.style.display = "block";
  } else {    
    const json = await response.json();
    console.log("getVersion(): json.version:" + json.version + " manifestData.version:" + manifestData.version);
    if (json.version == manifestData.version) {
      chrome.storage.local.set({ "lastCheckedVer": day });
      document.getElementById("versionLabel").innerHTML = `ver ${json.version}`;
      warningWindow.style.display = "none";
      loadlast();
    } else {
      document.getElementById("window-login-container").style.display = "none";
      warningWindow.style.display = "block";
    }
  }
}

function loadlast() {
  let data = document.querySelectorAll('input:not([id*="password"]');
  let selectData = document.querySelectorAll('select');
  
  data.forEach(function(el) {
    keys.push(el.id)  
  });

  selectData.forEach(function(el) {
    keys.push(el.id)
  });

  chrome.storage.local.get(keys, function(keyData) {
    let buttonUpdated = false;

    for (let key of keys) {
      let field = document.getElementById(key);

      if (key == "propertyOwnerPays" || key == "listingAgentPays") {
        if (keyData[key] != null) {
          if (buttonUpdated == false) {
            if (keyData[key] == true) {
              document.getElementById("createProposalNoFeeButton").disabled = true;
              document.getElementById("createProposalFeeButton").disabled = false;
              buttonUpdated = true;

              if (key == "listingAgentPays" && keyData[key] == true) {
                document.getElementById("proposedCommissionRate").disabled = false;
                document.getElementById("listingAgentPaysLabel").style.fontWeight = "bold";
                document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "normal";
                document.getElementById("listingAgentPays").checked = true;
                document.getElementById("propertyOwnerPays").checked = false;
              }

              if (key == "propertyOwnerPays" && keyData[key] == true) {
                document.getElementById("proposedCommissionRate").disabled = true;
                document.getElementById("listingAgentPaysLabel").style.fontWeight = "normal";
                document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "bold";
                document.getElementById("listingAgentPays").checked = false;
                document.getElementById("propertyOwnerPays").checked = true;
              }
            }
            else {
              document.getElementById("createProposalNoFeeButton").disabled = false;
              document.getElementById("createProposalFeeButton").disabled = true;
              document.getElementById("proposedCommissionRate").disabled = true;
              document.getElementById("listingAgentPays").checked = false;
              document.getElementById("propertyOwnerPays").checked = false;
            }
          }
        }
      }
      else {
        if (keyData[key] != null) field.value = keyData[key];
        field.oninput = saveData;
      }

      if (key == "lowPriceRange" || key == "highPriceRange") {
        formatCurrencyFields();
      }
    }

    validateFormData();
  });

  chrome.storage.local.get(["step"], function(stepData) {
    let loginWindow = document.getElementById("window-login-container");
    if (stepData.step != null ) {
      loginWindow.style.display = "none";
      let activewindow = document.getElementById(stepData.step);
      activewindow.style.display = "block";

      if (stepData.step == "window-dashboard-container") {
        chrome.storage.local.get(["search"], function(searchData) {
          if (searchData != "") {
            searchListings();
          }
          else {
            loadDashboardData();
          }
        });
      }
    } else {
      loginWindow.style.display = "block";
    }
  });

  chrome.storage.local.get(["leadData"], function(lead) {
    let leadData = lead.leadData;

    if (leadData != null && leadData.lead != null && typeof(leadData.lead) != "string") {
      let addressString = `${leadData.lead.firstname} ${leadData.lead.lastname}`;
      if (leadData.lead.address) {
        let leadAddress = leadData.lead.address;
        if (leadAddress.unitNumber && leadAddress.unitNumber != '' && leadAddress.unitNumber != null) {
          addressString += `, ${leadAddress.unitNumber}`;
        }
        if (leadAddress.streetNumber && leadAddress.streetNumber != '' && leadAddress.streetNumber != null) {
          addressString += `, ${leadAddress.streetNumber}`;
        }
        if (leadAddress.buildingName && leadAddress.buildingName != '' && leadAddress.buildingName != null) {
          addressString += `, ${leadAddress.buildingName}`;
        }
        if (leadAddress.streetName && leadAddress.streetName != '' && leadAddress.streetName != null) {
          addressString += `, ${leadAddress.streetName}`;
        }
        if (leadAddress.suburb && leadAddress.suburb != '' && leadAddress.suburb != null) {
          addressString += `, ${leadAddress.suburb}`;
        }
        if (leadAddress.state && leadAddress.state != '' && leadAddress.state != null) {
          addressString += `, ${leadAddress.state}`;
        }
        if (leadAddress.postcode && leadAddress.postcode != '' && leadAddress.postcode != null) {
          addressString += `, ${leadAddress.postcode}`;
        }
      }

      document.getElementById("detailsAddress").innerHTML = addressString;
      document.getElementById("window-application-container").getElementsByClassName("submitted-details-address")[0].innerHTML = addressString;

      document.getElementById("propertyOwnerAmountS").innerHTML = formatCurrency(leadData.lead.preApprovedAmount);
      document.getElementById("propertyOwnerFeeS").innerHTML = formatCurrency(leadData.vendorFee);
      document.getElementById("propertyOwnerTotalS").innerHTML = formatCurrency(leadData.total_repayments);

      if (leadData.status == 'P') {
        document.getElementById("window-application-container").getElementsByClassName("header")[0].innerHTML = "In Process";
        document.getElementById("window-application-container").getElementsByTagName("h2")[0].innerHTML = "Application has been<br />submitted";
      }

      if (leadData.status == 'A') {
        document.getElementById("window-application-container").getElementsByClassName("header")[0].innerHTML = "APPROVED";
        document.getElementById("window-application-container").getElementsByTagName("h2")[0].innerHTML = "Application has been<br />approved";
      }

      document.getElementById("lowPriceRange").innerHTML = formatCurrency(leadData.lead.listLowPrice);
      document.getElementById("highPriceRange").innerHTML = formatCurrency(leadData.lead.listHighPrice);
      document.getElementById("offerAmount").innerHTML = formatCurrency(leadData.preApprovedAmount);
      document.getElementById("propertyOwnerAmount").innerHTML = formatCurrency(leadData.preApprovedAmount);
      document.getElementById("propertyOwnerFee").innerHTML = formatCurrency(leadData.vendorFee);
      document.getElementById("propertyOwnerTotal").innerHTML = formatCurrency(leadData.total_repayments);

      for (const element of document.getElementsByClassName("proposed-commission-input")) {
        element.value = formatPercentage(leadData.partnerCommissionRate);
      }

      for (const element of document.getElementsByClassName("proposed-gross-commission")) {
        element.innerHTML = formatCurrency(leadData.grossCommission);
      }

      for (const element of document.getElementsByClassName("fee")) {
        element.innerHTML = formatCurrency(leadData.lead.partnerPaysFees == true ? leadData.partnerFee : leadData.vendorFee);
      }

      for (const element of document.getElementsByClassName("net-commission-rate")) {
        element.innerHTML = formatPercentage(leadData.netCommissionRate);
      }

      for (const element of document.getElementsByClassName("net-commission-amount")) {
        element.innerHTML = formatCurrency(leadData.netCommission);
      }

      if (leadData.lead.partnerPaysFees == true) {
        document.getElementById("listingAgentPays").checked = true;
        document.getElementById("listingAgentPaysLabel").style.fontWeight = "bold";
        document.getElementById("proposedCommissionRate").disabled = false;
        document.getElementById("createProposalFeeButton").disabled = false;
        document.getElementById("createProposalNoFeeButton").disabled = true;
        document.getElementsByClassName("listing-agent-main-details")[0].style.display = 'block';
      }
      else if (leadData.lead.partnerPaysFees == false) {
        document.getElementById("propertyOwnerPays").checked = true;
        document.getElementById("listingAgentPays").checked = false;
        document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "bold";
        document.getElementById("listingAgentPaysLabel").style.fontWeight = "normal";
        document.getElementsByClassName("property-owner-main-details")[0].style.display = 'block';
        
        document.getElementById("proposedCommissionRate").disabled = true;
        document.getElementById("createProposalFeeButton").disabled = false;
        document.getElementById("createProposalNoFeeButton").disabled = true;
      }
    }
    else {
      buildAddressLine(keys);
    }
  });
}

mapLookup.addEventListener("keyup", function(e) {
  if (mapLookup.value.length > 3) {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
    };

    fetch("https://2547-103-74-67-50.au.ngrok.io/addresses?q=" + mapLookup.value, {
      method: "GET",
      headers: headersList
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      let resultData = JSON.parse(data);
      addressResults.style.display = 'block';

      var results = "";
      resultData.forEach(function(result) {
        if (result.sla) {  
          let pdId = (typeof result.pid !== 'undefined' ) ? result.pid : result.links.self.href.replace('/addresses/', '');        
          results += `<div class="mapSearchResultsItem" data-pid="${pdId}">${result.sla}</div>`;
        }
      });

      addressResults.innerHTML = results;

      for (const element of document.getElementsByClassName("mapSearchResultsItem")) {
        element.addEventListener("click", function(e) {
          getAddressStructure(element.dataset['pid']);
          addressResults.style.display = 'none';
          mapLookup.value = element.textContent;
        });
      }

      document.getElementById("window-new-listing-container").getElementsByClassName("end-divider")[0].style.display = 'none';
      document.getElementById("window-new-listing-container").getElementsByClassName("bottom-navigation-container")[0].style.display = 'none';
    }).catch((error) => {
      console.log('Error: ', error);
    });
  }
});

function getAddressStructure(pid) {
  document.getElementById("window-new-listing-container").getElementsByClassName("end-divider")[0].style.display = 'block';
  document.getElementById("window-new-listing-container").getElementsByClassName("bottom-navigation-container")[0].style.display = 'flex';

  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
  };

  fetch("https://2547-103-74-67-50.au.ngrok.io/addresses/" + pid, {
    method: "GET",
    headers: headersList
  }).then(function(response) {
    return response.text();
  }).then(function(data) {
    let result = JSON.parse(data);
    chrome.storage.local.set({ "fullAddress": result.sla });
    let structured = result.structured;
    chrome.storage.local.set({ "splitAddresses": structured });
  }).catch((error) => {
    console.log('Error: ', error);
  });
}

function parseCurrecyTextToFloat(text) {
  return parseFloat(text.replace('$', '').split(',').join(''));
}

function formatCurrency(elm) {
  if (!elm) return '$0.00';

  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
  })

  return formatter.format(elm);
}

function formatPercentage(elm) {
  if (!elm) return '0.00%';

  const formatter = new Intl.NumberFormat('en-US', {
      style: 'percent',      
      maximumFractionDigits: 2
  })
  return formatter.format(elm);
}

function removeNumberFormat(elm) {
  if (!elm) return '';

  const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',      
      useGrouping: false
  })
  return formatter.format(elm);
}

function formatCurrencyFields() {
  let lowPriceRangeValue = parseCurrecyTextToFloat(lowPriceRange.value);
  document.getElementById("lowPriceRange").value = formatCurrency(lowPriceRangeValue);
  let highPriceRangeValue = parseCurrecyTextToFloat(highPriceRange.value);
  document.getElementById("highPriceRange").value = formatCurrency(highPriceRangeValue);
}

function removeCurrencyFields(elm) {
  let num = parseCurrecyTextToFloat(elm.value);
  elm.value = removeNumberFormat(num);  
}

function saveData(e) {
  if (this.id != "propertyOwnerPays" && this.id != "listingAgentPays") {
    chrome.storage.local.set({[this.id]: this.value});
  }
}

function clearData() { // To be called when you submit your data
  chrome.storage.local.remove(keys);
  for (let key of keys) {
    let field = document.getElementById(key);
    field.value = "";
  }
}

// show & hide eye on password click
togglePassword.addEventListener("click", async () => { showHidePassword() });

// login fields validation
emailAddress[0].addEventListener("keypress", async () => { validateLoginFields(); });
password[0].addEventListener("keypress", async () => { validateLoginFields(); });

// forgot password link
forgotPassword[0].addEventListener("click", async () => { goToForgotPassword(); });

partnerPortalLink.addEventListener("click", async () => { window.open("https://portal.elepay.com.au/login", "_blank"); });

// return to login link
returnToLogin[0].addEventListener("click", async () => { goToForgotPassword(); });

// login button click
loginButton.addEventListener("click", async () => { login(); });
loginButton.disabled = true;

returnToDashboardBoosterButton.addEventListener("click", async () => { goToDashboard(); });
returnToDashboardApplicationButton.addEventListener("click", async () => { goToDashboard(); });

searchButton.addEventListener("click", async () => { searchListings(); });

newButton.addEventListener("click", async () => { goToNewListing(); });
marketingButton.addEventListener("click", async () => { goToMarketing(); });

logoutButton1.addEventListener("click", async () => { logOut(); });
logoutButton2.addEventListener("click", async () => { logOut(); });
logoutButton3.addEventListener("click", async () => { logOut(); });
logoutButton4.addEventListener("click", async () => { logOut(); });

sendRecoveryLinkButton.addEventListener("click", async () => { sendResetLink(); });

backButton1.addEventListener("click", async () => { goBack(); });
backButton2.addEventListener("click", async () => { goBack(); });
backButton3.addEventListener("click", async () => { goBack(); });

editDetailsLink.addEventListener("click", async () => { editDetails(); });

lowPriceRange.addEventListener("blur", async () => { formatCurrencyFields(); });
lowPriceRange.addEventListener("focus", async () => { removeCurrencyFields(lowPriceRange); });
highPriceRange.addEventListener("blur", async () => { formatCurrencyFields(); });
highPriceRange.addEventListener("focus", async () => { removeCurrencyFields(highPriceRange); });
proposedCommissionRate.addEventListener("focus", async () => { removeCurrencyFields(proposedCommissionRate); }); 

firstName.addEventListener("keypress", async () => { validateFormData(); });
lastName.addEventListener("keypress", async () => { validateFormData(); });
contactNumber.addEventListener("keypress", async () => { validateFormData(); });
email.addEventListener("keypress", async () => { validateFormData(); });
propertyType.addEventListener("keypress", async () => { validateFormData(); });
fullAddress.addEventListener("keypress", async () => { validateFormData(); });
startDate.addEventListener("keypress", async () => { validateFormData(); });
lowPriceRange.addEventListener("keypress", async () => { validateFormData(); });
highPriceRange.addEventListener("keypress", async () => { validateFormData(); });

firstName.addEventListener("change", async () => { validateFormData(); });
lastName.addEventListener("change", async () => { validateFormData(); });
contactNumber.addEventListener("change", async () => { validateFormData(); });
email.addEventListener("change", async () => { validateFormData(); });
propertyType.addEventListener("change", async () => { validateFormData(); });
fullAddress.addEventListener("change", async () => { validateFormData(); });
startDate.addEventListener("change", async () => { validateFormData(); });
lowPriceRange.addEventListener("change", async () => { validateFormData(); });
highPriceRange.addEventListener("change", async () => { validateFormData(); });

calculateButton.addEventListener("click", async () => { submitLead(false, true, true); });

propertyOwnerPaysCheckbox.addEventListener("change", async () => { updateWhoPays('propertyOwner'); });
listingAgencyPaysCheckbox.addEventListener("change", async () => { updateWhoPays('listingAgent'); });

noFeeProposalButton.addEventListener("click", async () => { createInProgressProposal(); });
feeProposalButton.addEventListener("click", async () => { createInProgressProposal(); });

proposedCommissionRate.addEventListener("change", async () => {  updateProposedCommissionRate(); });

function showHidePassword() {
  let password = document.getElementById('password');
  let type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  // toggle the eye slash icon
  password.classList.toggle('fa-eye-slash');
}

function validateLoginFields() {
  let emailValue = document.getElementById("email").value;
  let passwordValue = document.getElementById("password").value;

  if (emailValue != "" && passwordValue != "") loginButton.disabled = false;
  else loginButton.disabled = true;
}

function validateFormData() {
  let data = document.querySelectorAll('.window-new-listing-container input:not([id*="password"]');
  let selectData = document.querySelectorAll('.window-new-listing-container select');
  let formKeys = [];
  data.forEach(function(el) {
    formKeys.push(el.id)  
  });

  selectData.forEach(function(el) {
    formKeys.push(el.id)
  });

  let valid = true;

  for (let formKey in formKeys) {
    if (document.getElementById(formKeys[formKey]).value.length === 0) valid = false;
    if ((formKeys[formKey] == "lowPriceRange" || formKeys[formKey] == "highPriceRange") && document.getElementById(formKeys[formKey]).value == formatCurrency(0)) {
      valid = false;
    }
  }

  if (valid == true) {
    document.getElementById("calculateButton").disabled = false;
  } else {
    document.getElementById("calculateButton").disabled = true;
  }
}

function sendResetLink() {
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
  };

  fetch("https://stage.elepay.com.au/re_forgotten", { 
    method: "POST",
    body: JSON.stringify({ "email": document.getElementById("email").value }),
    headers: headersList
  }).then(function(response) {
    return response.text();
  }).then(function(data) {
    let json = JSON.parse(data);

    if (json.result == "success") {
      alert(json.message);
    }
    else {
      alert("Reset password has not been sent.");
    }
  });
}

function goToForgotPassword() {
  let loginWindow = document.getElementById("login-container-main");
  if (loginWindow.style.display === "none") {
    loginWindow.style.display = "block";
  } else {
    loginWindow.style.display = "none";
  }

  let forgotPasswordWindow = document.getElementById("forgot-password-container-main");
  if (forgotPasswordWindow.style.display === "none") {
    forgotPasswordWindow.style.display = "block";
  } else {
    forgotPasswordWindow.style.display = "none";
  }

  if (loginButton.style.display === "none") {
    loginButton.style.display = "block";
  } else {
    loginButton.style.display = "none";
  }

  if (sendRecoveryLinkButton.style.display === "none") {
    sendRecoveryLinkButton.style.display = "block";
  } else {
    sendRecoveryLinkButton.style.display = "none";
  }
}

function login() {
  let headersList = {
    "Accept": "*/*",    
    "Content-Type": "application/json"
  };
   
  fetch("https://stage.elepay.com.au/front/login", { 
    method: "POST",
    body: JSON.stringify({ "email": document.getElementById("login_email").value, "password": document.getElementById("password").value }),
    headers: headersList
  }).then(function(response) {      
    return response.text();
  }).then(function(data) {
    chrome.storage.local.set({ "authToken": data }, function() {
    });
    if (data == '\"UNAUTHORIZED\"') alert('Password is incorrect');
    else {
      let loginWindow = document.getElementById("window-login-container");
      if (loginWindow.style.display === "none") {
        loginWindow.style.display = "block";
      } else {
        loginWindow.style.display = "none";
      }

      let dashboardWindow = document.getElementById("window-dashboard-container");
      if (dashboardWindow.style.display === "none") {
        dashboardWindow.style.display = "block";
      } else {
        dashboardWindow.style.display = "none";
      }

      // get the dashboard data
      loadDashboardData();
    }
  });
}

function updateWhoPays(active) {
  let propertyOwnerPaysValue = document.getElementById("propertyOwnerPays").checked;
  let listingAgentPaysValue = document.getElementById("listingAgentPays").checked;

  if (propertyOwnerPaysValue == true || listingAgentPaysValue == true) {
    if (propertyOwnerPaysValue == true && active == 'listingAgent') {
      document.getElementById("propertyOwnerPays").checked = false;
      document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "normal";
      document.getElementById("proposedCommissionRate").disabled = false;
    }
    else if (listingAgentPaysValue == true && active == 'propertyOwner') {
      document.getElementById("listingAgentPays").checked = false;
      document.getElementById("listingAgentPaysLabel").style.fontWeight = "normal";
      document.getElementById("proposedCommissionRate").disabled = true;
    }

    if (active == 'listingAgent') {
      document.getElementById("listingAgentPaysLabel").style.fontWeight = "bold";
      document.getElementById("proposedCommissionRate").disabled = false;
    }
    else {
      document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "bold";
      document.getElementById("proposedCommissionRate").disabled = true;
      document.getElementById("netCommission").innerHTML = '';
    }

    document.getElementById("createProposalNoFeeButton").disabled = true;
    document.getElementById("createProposalFeeButton").disabled = false;
  }
  else {
    document.getElementById("createProposalNoFeeButton").disabled = false;
    document.getElementById("createProposalFeeButton").disabled = true;
    document.getElementById("proposedCommissionRate").disabled = true;
    document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "normal";
    document.getElementById("listingAgentPaysLabel").style.fontWeight = "normal";
    document.getElementById("netCommission").innerHTML = '';
  }

  chrome.storage.local.set({"propertyOwnerPays": document.getElementById("propertyOwnerPays").checked});
  chrome.storage.local.set({"listingAgentPays": document.getElementById("listingAgentPays").checked});
}

function updateProposedCommissionRate() {
  document.getElementById("proposedCommissionRate").value = formatPercentage(document.getElementById("proposedCommissionRate").value / 100);
  submitLead(false, true, false);
}

function goToDashboard() {
  chrome.storage.local.get(["step"], function(data) {
    let nextWindow = null;

    chrome.storage.local.get("previousStep", function(stepData) {
      if (stepData != null) {
        chrome.storage.local.remove(["previousStep"]);
        chrome.storage.local.remove(["leadId"]);
        chrome.storage.local.remove(["leadData"]);
        clearData();
      }

      if (data.step != null) {
        let currentWindow = document.getElementById(data.step);
        currentWindow.style.display = "none";
        document.getElementsByClassName("listing-agent-main-details")[0].style.display = 'none';
        document.getElementsByClassName("property-owner-main-details")[0].style.display = 'none';
  
        nextWindow = document.getElementById("window-dashboard-container");
        chrome.storage.local.set({"step": "window-dashboard-container"});
  
        if (document.getElementById("search").value != "") {
          chrome.storage.local.set({"step": "window-dashboard-container"});
          searchListings();
        }
        else {
          loadDashboardData();
        }
  
        nextWindow.style.display = "block";
      }
    });
  });
}

function loadDashboardData() {
  chrome.storage.local.set({"step": "window-dashboard-container"});
  chrome.storage.local.get(["authToken"], function(items) {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + items.authToken
    };

    fetch("https://stage.elepay.com.au/front/lead/search", {
      method: "POST",
      headers: headersList
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      if (data == "") {
        document.getElementById("no-listings").style.display = "block";
        document.getElementById("listings").style.display = "none";
      }
      else {
        document.getElementById("listings").innerHTML = "";
        let headingDiv = document.createElement('div');
        headingDiv.className = "most-recent-header";
        headingDiv.innerHTML = "Most Recent 10 Listings";
        document.getElementById("listings").append(headingDiv);

        document.getElementById("no-listings").style.display = "none";
        document.getElementById("listings").style.display = "block";

        let resultData = JSON.parse(data);
        let leads = resultData.leads;

        for (let l in leads) {
          let lead = leads[l];
          let newMainDiv = document.createElement('div');
          newMainDiv.id = "lead_" + lead.id;
          newMainDiv.style.display = "flex";
          let newImage = document.createElement('img');

          let imageIcon = "/images/No-Fees-Selected-Icon.png";
          if (lead.status == "agentPays" || lead.status == "vendorPays") {
            imageIcon = "/images/Fees-Selected-Icon.png";
          }
          if (lead.status && (lead.status == "A" || lead.status == "P")) {
            imageIcon = "/images/Approved-or-Submitted-Icon.png";
          }

          newImage.src = imageIcon;
          newMainDiv.append(newImage);

          let newDiv = document.createElement('div');
          let newDivInnerHtml = `${lead.firstname} ${lead.lastname} ${lead.address != '' ? `, ${lead.address}` : ''}`;

          if (newDivInnerHtml.length > 45)
            newDivInnerHtml = newDivInnerHtml.substring(0, 45) + '...';

          newDiv.innerHTML = newDivInnerHtml;
          newMainDiv.append(newDiv);

          document.getElementById("listings").appendChild(newMainDiv);
          document.getElementById("lead_" + lead.id).addEventListener("click", async () => { getLead(lead.id); });
        }
      }
    });
  });
}

function searchListings() {
  chrome.storage.local.get(["authToken"], function(items) {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + items.authToken
    };

    let searchTerm = document.getElementById("search").value;

    if (searchTerm != "") {
      fetch(`https://stage.elepay.com.au/front/lead/search?q=${searchTerm}`, {
        method: "POST",
        headers: headersList
      }).then(function(response) {
        return response.text();
      }).then(function(data) {
        if (data == "") {
          document.getElementById("no-listings").style.display = "block";
          document.getElementById("listings").style.display = "none";
        }
        else {
          document.getElementById("listings").innerHTML = "";
          let headingDiv = document.createElement('div');
          headingDiv.className = "most-recent-header";
          headingDiv.innerHTML = "Most Recent 10 Listings";
          document.getElementById("listings").append(headingDiv);

          document.getElementById("no-listings").style.display = "none";
          document.getElementById("listings").style.display = "block";
  
          let resultData = JSON.parse(data);
          let leads = resultData.leads;
  
          for (let l in leads) {
            let lead = leads[l];
            let newMainDiv = document.createElement('div');
            newMainDiv.id = "lead_" + lead.id;
            newMainDiv.style.display = "flex";
            let newImage = document.createElement('img');

            let imageIcon = "/images/No-Fees-Selected-Icon.png";
            if (lead.partnerPaysFees != null) {
              imageIcon = "/images/Fees-Selected-Icon.png";
            }
            if (lead.status && (lead.status == "A" || lead.status == "P")) {
              imageIcon = "/images/Approved-or-Submitted-Icon.png";
            }

            newImage.src = imageIcon;
            newMainDiv.append(newImage);
  
            let newDiv = document.createElement('div');
            let newDivInnerHtml = `${lead.firstname} ${lead.lastname} ${lead.address != '' ? `, ${lead.address}` : ''}`;
  
            if (newDivInnerHtml.length > 45)
              newDivInnerHtml = newDivInnerHtml.substring(0, 45) + '...';
  
            newDiv.innerHTML = newDivInnerHtml;
            newMainDiv.append(newDiv);
  
            document.getElementById("listings").appendChild(newMainDiv);
            document.getElementById("lead_" + lead.id).addEventListener("click", async () => { getLead(lead.id); });
          }
        }
      });
    }
    else {
      loadDashboardData();
    }
  });
}

function logOut() {
  chrome.storage.local.get(["step"], function(data) {
    let loginWindow = document.getElementById("window-login-container");

    if (data.step != null) {
      let currentWindow = document.getElementById(data.step);
      currentWindow.style.display = "none";
      loginWindow.style.display = "block";
      chrome.storage.local.remove(["step"]);
    }
    else {
      loginWindow.style.display = "none";
    }
  });
}

function loadListingDetails() {
  let data = document.querySelectorAll('input:not([id*="password"]');
  
  data.forEach(function(el) {
    if (keys.indexOf(el.id) < 0) keys.push(el.id);
  });

  chrome.storage.local.get(["leadData"], function(leadMetaData) {
    if (leadMetaData.leadData.lead) {
      let lead = leadMetaData.leadData.lead;
      chrome.storage.local.set({"leadId":lead.id});

      chrome.storage.local.set({"emailAddress":lead.email});
      document.getElementById("emailAddress").value = lead.email;
      chrome.storage.local.set({"firstName":lead.firstname});
      document.getElementById("firstName").value = lead.firstname;
      chrome.storage.local.set({"lastName":lead.lastname});
      document.getElementById("lastName").value = lead.lastname;
      chrome.storage.local.set({"contactNumber":lead.phone});
      document.getElementById("contactNumber").value = lead.phone;

      let fullAddress = "";
      if (lead.address) {
        if (lead.address.unitNumber && lead.address.unitNumber != "") {
          fullAddress += `${lead.address.unitNumber} / `;
        }
        if (lead.address.streetNumber && lead.address.streetNumber != "") {
          fullAddress += `${lead.address.streetNumber}, `;
        }
        if (lead.address.buildingName && lead.address.buildingName != "") {
          fullAddress += `${lead.address.buildingName}, `;
        }
        if (lead.address.streetName && lead.address.streetName != "") {
          fullAddress += `${lead.address.streetName}, `;
        }
        if (lead.address.suburb && lead.address.suburb != "") {
          fullAddress += `${lead.address.suburb}, `;
        }
        if (lead.address.state && lead.address.state != "") {
          fullAddress += `${lead.address.state}, `;
        }
        if (lead.address.postcode && lead.address.postcode != "") {
          fullAddress += lead.address.postcode;
        }
      }

      chrome.storage.local.set({"fullAddress": fullAddress});
      document.getElementById("fullAddress").value = fullAddress;
      chrome.storage.local.set({"propertyType":(lead.address.type.substring(0,1).toUpperCase() + lead.address.type.substring(1))});
      document.getElementById("propertyType").value = lead.address.type.substring(0,1).toUpperCase() + lead.address.type.substring(1);

      let startDateValue = new Date(`${lead.startdate.year}-${lead.startdate.month}-${lead.startdate.day}`);
      chrome.storage.local.set({"startDate": (startDateValue.getFullYear() + "-" + (startDateValue.getMonth()+1 < 10 ? '0'+(parseInt(startDateValue.getMonth())+1) : startDateValue.getMonth()) + "-" + (startDateValue.getDate() < 10 ? ('0'+startDateValue.getDate()) : startDateValue.getDate()))});
      document.getElementById("startDate").value = (startDateValue.getFullYear() + "-" + (startDateValue.getMonth()+1 < 10 ? '0'+(parseInt(startDateValue.getMonth())+1) : startDateValue.getMonth()) + "-" + (startDateValue.getDate() < 10 ? ('0'+startDateValue.getDate()) : startDateValue.getDate()));

      chrome.storage.local.set({"lowPriceRange":lead.listLowPrice});
      document.getElementById("lowPriceRange").value = formatCurrency(lead.listLowPrice);
      chrome.storage.local.set({"highPriceRange":lead.listHighPrice});
      document.getElementById("highPriceRange").value = formatCurrency(lead.listHighPrice);
      chrome.storage.local.set({"proposedCommissionRate":leadMetaData.leadData.partnerCommissionRate});
      document.getElementById("proposedCommissionRate").value = formatPercentage(leadMetaData.leadData.partnerCommissionRate);
      chrome.storage.local.set({"netCommission": leadMetaData.leadData.partnerCommission});
      document.getElementById("netCommission").value = formatCurrency(leadMetaData.leadData.netCommission);
    }
  });
}

function editDetails() {
  loadListingDetails();

  chrome.storage.local.get(["step"], function(data) {
    let nextWindow = null;

    if (data.step != null) {
      let currentWindow = document.getElementById(data.step);
      currentWindow.style.display = "none";
      nextWindow = document.getElementById("window-new-listing-container");
      nextWindow.style.display = "block";
      chrome.storage.local.set({"previousStep": "window-approved-booster-container"});
      chrome.storage.local.set({"step": "window-new-listing-container"});
    }
  });
}

function goToNewListing() {
  document.getElementById("propertyOwnerPays").checked = false;
  document.getElementById("listingAgentPays").checked = false;

  let dashboardWindow = document.getElementById("window-dashboard-container");
  if (dashboardWindow.style.display === "none") {
    dashboardWindow.style.display = "block";
  } else {
    dashboardWindow.style.display = "none";
  }

  let listingWindow = document.getElementById("window-new-listing-container");
  if (listingWindow.style.display === "none") {
    listingWindow.style.display = "block";
    chrome.storage.local.set({"step": "window-new-listing-container"});
  } else {
    listingWindow.style.display = "none";
  }
}

function goToMarketing() {
  chrome.storage.local.get(["authToken"], function(items) {        
      var base64Url = items.authToken.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      json = JSON.parse(jsonPayload);      
      window.open("http://stage.elepay.com.au/partner/page/marketing?d=" + btoa(json.upn + ":" + Date.now()), "_blank");
  });
  
}

function goBack() {
  chrome.storage.local.get(["step"], function(data) {
    let previousWindow = null;

    if (data.step != null) {
      let currentWindow = document.getElementById(data.step);
      currentWindow.style.display = "none";

      chrome.storage.local.get("previousStep", function(stepData) {
        let previousStep = stepData.previousStep;

        if (previousStep == null) {
          if (data.step == "window-approved-booster-container") {
            previousStep = "window-new-listing-container";
          }
          else {
            previousStep = "window-dashboard-container";
          }
        }

        if (previousStep == "window-approved-booster-container" && data.step == "window-approved-booster-container") {
          previousStep = "window-new-listing-container";
        }

        previousWindow = document.getElementById(previousStep);
        previousWindow.style.display = "block";
        chrome.storage.local.set({"step": previousStep});

        if (previousStep == "window-approved-booster-container" && data.step == "window-new-listing-container") {
          chrome.storage.local.set({"step": "window-approved-booster-container"});
          chrome.storage.local.set({"previousStep": "window-dashboard-container"});
        }

        if (previousStep == "window-approved-booster-container" && data.step == "window-approved-booster-container") {
          chrome.storage.local.set({"step": "window-new-listing-container"});
          chrome.storage.local.set({"previousStep": "window-dashboard-container"});
        }

        if (previousStep == "window-dashboard-container") {
          chrome.storage.local.set({"step": "window-dashboard-container"});
          chrome.storage.local.remove(["previousStep"]);
          chrome.storage.local.remove(["leadId"]);
          clearData();

          if (document.getElementById("search").value != "") {
            chrome.storage.local.set({"step": previousStep});
            searchListings();
          }
          else {
            loadDashboardData();
          }
        }
      });
    }
  });
}

function submitLead(createPDFafter, updateAgentFees, redirect) {
  chrome.storage.local.get(["leadData"], function(leadMeta) {
    let lead = null;
    if (leadMeta.leadData != null) {
      lead = leadMeta.leadData.lead;
      chrome.storage.local.set({"leadId":lead.id});
    }

    let data = document.querySelectorAll('.window-new-listing-container input:not([id*="password"]');
    let selectData = document.querySelectorAll('.window-new-listing-container select');
    let formKeys = [];

    data.forEach(function(el) {
      formKeys.push(el.id)  
    });

    selectData.forEach(function(el) {
      formKeys.push(el.id)
    });

    let requestObject = {
      'address': {},
      'product': {}
    };

    for (let formKey in formKeys) {
      switch (formKeys[formKey]) {
        case 'firstName':
          requestObject[formKeys[formKey].toLowerCase()] = document.getElementById(formKeys[formKey]).value || lead.firstname;
          break;
        case 'lastName':
          requestObject[formKeys[formKey].toLowerCase()] = document.getElementById(formKeys[formKey]).value || lead.lastname;
          break;
        case 'startDate':
          if (document.getElementById(formKeys[formKey]).value == "") {
            let startDateValue = new Date(`${lead.startdate.year}-${lead.startdate.month}-${lead.startdate.day}`);
            requestObject[formKeys[formKey].toLowerCase()] = (startDateValue.getFullYear() + "-" + (startDateValue.getMonth()+1 < 10 ? '0'+(parseInt(startDateValue.getMonth())+1) : startDateValue.getMonth()) + "-" + (startDateValue.getDate() < 10 ? ('0'+startDateValue.getDate()) : startDateValue.getDate()));
          }
          else {
            requestObject[formKeys[formKey].toLowerCase()] = document.getElementById(formKeys[formKey]).value;
          }

          break;
        case 'contactNumber':
          requestObject.phone = document.getElementById(formKeys[formKey]).value.replace(/ /g, '') || lead.phone;
          break;
        case 'emailAddress':
          requestObject.email = document.getElementById(formKeys[formKey]).value || lead.email;
          break;
        case 'fullAddress':
          chrome.storage.local.get(["splitAddresses"], function(address) {
            let addressArray = address.splitAddresses;
            if (addressArray != null) {
              // if this is a unit it will have flat in the structure
              if (addressArray.flat && addressArray.flat.number) {
                requestObject.address.unitNumber = addressArray.flat.number;                
              }

              if (addressArray.buildingName) {                                
                if (addressArray.flat) {
                  requestObject.address.buildingName = addressArray.buildingName.replace(" UNIT ", '').replace(addressArray.flat.number, '');
                } else {
                  requestObject.address.buildingName = addressArray.buildingName.replace(" UNIT ", '');
                }
              }

              if (addressArray.number && addressArray.number.number) requestObject.address.streetNumber = addressArray.number.number;
              if (addressArray.street && addressArray.street.name) requestObject.address.streetName = addressArray.street.name;
              if (addressArray.street.type && addressArray.street.type.name) requestObject.address.streetName += ' ' + addressArray.street.type.name ;

              requestObject.address.suburb = addressArray.locality.name;
              requestObject.address.state = addressArray.state.abbreviation;
              requestObject.address.postcode = addressArray.postcode;
            }
            else {
              requestObject.address = lead.address;
            }
          });
          break;
        case 'propertyType':
          requestObject.address.type = document.getElementById(formKeys[formKey]).value.toLowerCase() || lead.address.type.toLowerCase();
          break;
        case 'lowPriceRange':
          requestObject.listLowPrice = document.getElementById(formKeys[formKey]).value.replace('$', '').replace(/,/g, '').replace('.00','');
          if (requestObject.listLowPrice == "0" || requestObject.listLowPrice == '') {
            requestObject.listLowPrice = lead.listLowPrice;
          }
          if (createPDFafter == false) {
            requestObject.requestedamount = parseFloat(document.getElementById(formKeys[formKey]).value.replace('$', '').replace(/,/g, '').replace('.00','')) || lead.listLowPrice;
          }
          break;
        case 'highPriceRange':
          requestObject.listHighPrice = document.getElementById(formKeys[formKey]).value.replace('$', '').replace(/,/g, '').replace('.00','');
          if (requestObject.listHighPrice == "0" || requestObject.listHighPrice == '') {
            requestObject.listHighPrice = lead.listHighPrice;
          }
          break;
      }
    }

    if (propertyOwnerPays.checked == true) {
      requestObject.partnerPaysFees = "false";
      requestObject.product.id = 9;
      requestObject.form_code = "paylater";
    }
    else if (listingAgentPays.checked == true) {
      requestObject.partnerCommissionRate = parseFloat(document.getElementById("proposedCommissionRate").value) / 100;
      requestObject.partnerPaysFees = "true";
      requestObject.product.id = 12;
      requestObject.form_code = "gen121_rlc";
    }
    else {
      requestObject.partnerPaysFees = null;
      requestObject.partnerCommissionRate = 0;
      requestObject.product.id = 12;
    }

    if (createPDFafter == true) {
      requestObject.requestedamount = leadMeta.leadData.preApprovedAmount;
    }

    chrome.storage.local.get(["leadId"], function(lead) {
      if (lead.leadId) {
        requestObject.id = lead.leadId;
      }

      chrome.storage.local.get(["authToken"], function(items) {
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + items.authToken
        };

        fetch("https://stage.elepay.com.au/front/lead", {
          method: "POST",
          body: JSON.stringify(requestObject),
          headers: headersList
        }).then(function(response) {
          return response.text();
        }).then(function(responseData) {
          let json = JSON.parse(responseData);
          chrome.storage.local.set({"leadId": json.id || json.lead.id});
          chrome.storage.local.set({"leadData": json});

          if (updateAgentFees == true) {
            document.getElementById("proposedCommissionRate").value = formatPercentage(json.partnerCommissionRate);
            document.getElementById("proposedGrossCommission").innerHTML = formatCurrency(json.grossCommission);
            document.getElementById("lessFee").innerHTML = formatCurrency(json.partnerFee);
            document.getElementById("netCommissionRate").innerHTML = formatPercentage(json.netCommissionRate);
            document.getElementById("netCommission").innerHTML = formatCurrency(json.netCommission);

            if (redirect == true) {
              goToApprovedBooster(formKeys);
            }
          }
          else {
            if (createPDFafter == true) {
              createPDF();
            }
            else {
              goToApprovedBooster(formKeys);
            }
          }
        });
      });
    });
  });
}

function createInProgressProposal() {
  submitLead(true, false, false);
}

function createPDF() {
  chrome.storage.local.get(["leadId"], function(data) {
    let lead_id = data.leadId;
    let boosterType = "booster";

    if (propertyOwnerPays.checked == true) {
      boosterType = "boosterVendor";
    }
    else if (listingAgentPays.checked == true) {
      boosterType = "boosterAgent";
    }

    clearData();
    chrome.storage.local.remove(["leadId"]);
    chrome.storage.local.remove(["leadData"]);
    chrome.storage.local.remove(["previousStep"]);
    chrome.storage.local.set({"step": "window-dashboard-container"});

    window.open("https://stage.elepay.com.au/lead/pdf/" + lead_id + "?type=" + boosterType, "_blank");
  });
}

function buildAddressLine(formKeys) {
  let addressString = "";

  for (let formKey in formKeys) {
    switch (formKeys[formKey]) {
      case 'firstName':
        addressString += document.getElementById(formKeys[formKey]).value + ' ';
        break;
      case 'lastName':
        addressString += document.getElementById(formKeys[formKey]).value + ', ';
        break;
      case 'fullAddress':
        addressString += document.getElementById(formKeys[formKey]).value;
        break;
    }
  }

  document.getElementById("detailsAddress").innerHTML = addressString;
}

function goToApprovedBooster(formKeys) {
  chrome.storage.local.get(["leadData"], function(data) {
    let leadData = data.leadData;

    buildAddressLine(formKeys);

    let newListingWindow = document.getElementById("window-new-listing-container");
    if (newListingWindow.style.display === "none") {
      newListingWindow.style.display = "block";
    } else {
      newListingWindow.style.display = "none";
    }
  
    let approvedBoosterWindow = document.getElementById("window-approved-booster-container");
    if (approvedBoosterWindow.style.display === "none") {
      approvedBoosterWindow.style.display = "block";
      chrome.storage.local.set({"step": "window-approved-booster-container"});
    } else {
      approvedBoosterWindow.style.display = "none";
    }
  
    document.getElementById("offerAmount").innerHTML = formatCurrency(leadData.preApprovedAmount);
    document.getElementById("propertyOwnerAmount").innerHTML = formatCurrency(leadData.preApprovedAmount);
    document.getElementById("propertyOwnerFee").innerHTML = formatCurrency(leadData.vendorFee);
    document.getElementById("propertyOwnerTotal").innerHTML = formatCurrency(leadData.total_repayments);
  });
}

function getLead(id) {
  chrome.storage.local.get(["authToken"], function(items) {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + items.authToken
    };

    fetch("https://stage.elepay.com.au/front/lead/" + id, {
      method: "GET",
      headers: headersList
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      let json = JSON.parse(data);
      chrome.storage.local.set({"leadData": json});

      updateData();
      goToApplication();
    });
  });
}

function updateData() {
  chrome.storage.local.get(["leadData"], function(data) {
    let leadData = data.leadData;

    if (leadData.lead) {
      let addressString = `${leadData.lead.firstname} ${leadData.lead.lastname}`;
      if (leadData.lead.address) {
        let leadAddress = leadData.lead.address;
        if (leadAddress.unitNumber && leadAddress.unitNumber != '' && leadAddress.unitNumber != null) {
          addressString += `, ${leadAddress.unitNumber}`;
        }
        if (leadAddress.streetNumber && leadAddress.streetNumber != '' && leadAddress.streetNumber != null) {
          addressString += `, ${leadAddress.streetNumber}`;
        }
        if (leadAddress.buildingName && leadAddress.buildingName != '' && leadAddress.buildingName != null) {
          addressString += `, ${leadAddress.buildingName}`;
        }
        if (leadAddress.streetName && leadAddress.streetName != '' && leadAddress.streetName != null) {
          addressString += `, ${leadAddress.streetName}`;
        }
        if (leadAddress.suburb && leadAddress.suburb != '' && leadAddress.suburb != null) {
          addressString += `, ${leadAddress.suburb}`;
        }
        if (leadAddress.state && leadAddress.state != '' && leadAddress.state != null) {
          addressString += `, ${leadAddress.state}`;
        }
        if (leadAddress.postcode && leadAddress.postcode != '' && leadAddress.postcode != null) {
          addressString += `, ${leadAddress.postcode}`;
        }
      }
      document.getElementById("detailsAddress").innerHTML = addressString;

      document.getElementById("propertyOwnerAmountS").innerHTML = formatCurrency(leadData.lead.preApprovedAmount);
      document.getElementById("propertyOwnerFeeS").innerHTML = formatCurrency(leadData.vendorFee);
      document.getElementById("propertyOwnerTotalS").innerHTML = formatCurrency(leadData.total_repayments);
    }

    document.getElementById("lowPriceRange").innerHTML = formatCurrency(leadData.lead.listLowPrice);
    document.getElementById("highPriceRange").innerHTML = formatCurrency(leadData.lead.listHighPrice);
    document.getElementById("offerAmount").innerHTML = formatCurrency(leadData.preApprovedAmount);
    document.getElementById("propertyOwnerAmount").innerHTML = formatCurrency(leadData.preApprovedAmount);
    document.getElementById("propertyOwnerFee").innerHTML = formatCurrency(leadData.vendorFee);
    document.getElementById("propertyOwnerTotal").innerHTML = formatCurrency(leadData.total_repayments);

    document.querySelectorAll(".proposed-commission-input").forEach( (x) => { x.value = formatPercentage(leadData.partnerCommissionRate) } ) ;    
    document.querySelectorAll("#proposedGrossCommission").forEach( (x) => { x.innerHTML = formatCurrency(leadData.grossCommission) } ) ;      
    document.querySelectorAll("#lessFee").forEach( (x) => { x.innerHTML = formatCurrency(leadData.partnerFee) } ) ;  
    document.querySelectorAll("#netCommissionRate").forEach( (x) => { x.innerHTML = formatPercentage(leadData.netCommissionRate) } ) ;      
    document.querySelectorAll("#netCommission").forEach( (x) => { x.innerHTML = formatCurrency(leadData.netCommission) } ) ;  

    if (leadData.status == "A" || leadData.status == "P") {
      if (leadData.status == 'P') {
        document.getElementById("window-application-container").getElementsByClassName("header")[0].innerHTML = "In Process";
        document.getElementById("window-application-container").getElementsByTagName("h2")[0].innerHTML = "Application has been<br />submitted";
      }
  
      if (leadData.status == 'A') {
        document.getElementById("window-application-container").getElementsByClassName("header")[0].innerHTML = "APPROVED";
        document.getElementById("window-application-container").getElementsByTagName("h2")[0].innerHTML = "Application has been<br />approved";
      }     
    }
    else {
      if (leadData.lead.partnerPaysFees == true) {
        document.getElementById("propertyOwnerPays").checked = false;
        document.getElementById("listingAgentPays").checked = true;
        document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "normal";
        document.getElementById("listingAgentPaysLabel").style.fontWeight = "bold";

        document.getElementById("proposedCommissionRate").disabled = false;
        document.getElementById("createProposalFeeButton").disabled = false;
        document.getElementById("createProposalNoFeeButton").disabled = true;
      }
      else if (leadData.lead.partnerPaysFees == false) {
        document.getElementById("propertyOwnerPays").checked = true;
        document.getElementById("listingAgentPays").checked = false;
        document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "bold";
        document.getElementById("listingAgentPaysLabel").style.fontWeight = "normal";  

        document.getElementById("proposedCommissionRate").disabled = true;
        document.getElementById("createProposalFeeButton").disabled = false;
        document.getElementById("createProposalNoFeeButton").disabled = true;
      }
      else {
        document.getElementById("propertyOwnerPays").checked = false;
        document.getElementById("listingAgentPays").checked = false;
        document.getElementById("propertyOwnerPaysLabel").style.fontWeight = "normal";
        document.getElementById("listingAgentPaysLabel").style.fontWeight = "normal";

        document.getElementById("proposedCommissionRate").disabled = true;
        document.getElementById("createProposalFeeButton").disabled = true;
        document.getElementById("createProposalNoFeeButton").disabled = false;
      }
    }
  });
}

function goToApplication() {
  chrome.storage.local.get(["leadData"], function(data) {
    let leadData = data.leadData;

    // hide dashboard
    document.getElementById("window-dashboard-container").style.display = "none";

    if (leadData.status == "A" || leadData.status == "P") {
      let listingWindow = document.getElementById("window-application-container");
      // if (listingWindow.style.display === "none") {
        if (leadData.lead.partnerPaysFees == true) {
          document.getElementsByClassName("listing-agent-main-details")[0].style.display = 'block';
        } else if (leadData.lead.partnerPaysFees == false) {
          document.getElementsByClassName("property-owner-main-details")[0].style.display = 'block';
        }

        let addressString = `${leadData.lead.firstname} ${leadData.lead.lastname}`;
        if (leadData.lead.address) {
          let leadAddress = leadData.lead.address;
          if (leadAddress.unitNumber && leadAddress.unitNumber != '' && leadAddress.unitNumber != null) {
            addressString += `, ${leadAddress.unitNumber}`;
          }
          if (leadAddress.streetNumber && leadAddress.streetNumber != '' && leadAddress.streetNumber != null) {
            addressString += `, ${leadAddress.streetNumber}`;
          }
          if (leadAddress.buildingName && leadAddress.buildingName != '' && leadAddress.buildingName != null) {
            addressString += `, ${leadAddress.buildingName}`;
          }
          if (leadAddress.streetName && leadAddress.streetName != '' && leadAddress.streetName != null) {
            addressString += `, ${leadAddress.streetName}`;
          }
          if (leadAddress.suburb && leadAddress.suburb != '' && leadAddress.suburb != null) {
            addressString += `, ${leadAddress.suburb}`;
          }
          if (leadAddress.state && leadAddress.state != '' && leadAddress.state != null) {
            addressString += `, ${leadAddress.state}`;
          }
          if (leadAddress.postcode && leadAddress.postcode != '' && leadAddress.postcode != null) {
            addressString += `, ${leadAddress.postcode}`;
          }
        }

        document.getElementById("window-application-container").getElementsByClassName("submitted-details-address")[0].innerHTML = addressString;
        listingWindow.style.display = "block";
        chrome.storage.local.set({"step": "window-application-container"});
      // } else {
      //   listingWindow.style.display = "none";
      //   document.getElementsByClassName("listing-agent-main-details")[0].style.display = 'none';
      //   document.getElementsByClassName("property-owner-main-details")[0].style.display = 'none';
      // }
    }
    else {
      let listingWindow = document.getElementById("window-approved-booster-container");
      // if (listingWindow.style.display === "none") {
        listingWindow.style.display = "block";
        chrome.storage.local.set({"step": "window-approved-booster-container"});
        chrome.storage.local.set({"previousStep": "window-dashboard-container"});
      // } else {
      //   listingWindow.style.display = "none";
      // }
    }
  });
}

function getToken() {
  let authToken = '';
  result.innerText = "";
  chrome.storage.local.get(["authToken"], function(items) {
    // debugger
    authToken = items.authToken;
    result.innerText = authToken;
  });
}
