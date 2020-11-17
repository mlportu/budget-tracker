//create varialbe to hold dv connnection

let db;

//establish a connection to IndexedDb database called budget-tracker and set it to version 1
const request = indexedDB.open('budget-tracker', 1);

//this event will emit if the database version changes(nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    //create an object store (table) called "new_budget_item", set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_budget_item', {autoIncrement: true});
};

// upon a successful
request.onsuccess = function(event){
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in globel variable 
    db = event.target.result;

    //check if app is online, if yes run uploadBudget() function to send all local db data to api
    if(navigator.onLine){
        //uploadBudget();
    }
};

request.onerror = function(event) {
    //log error here
    console.log(event.target.errorCode);
};

//this function will be executed if we attempt to submit a new budget item and there is no internet connection
function saveRecord(record){
    //open a new transation with the database with read adn write permission
    const transaction = db.transaction(['new_budget_item'], 'readwrite');
    
    //access the object store for 'new budget item
    const budgetObjectStore = transaction.objectStore('new_budget_item');

    //add record to your store with add method
    budgetObjectStore.add(record);
}