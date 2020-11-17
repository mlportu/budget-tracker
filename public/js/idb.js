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

    //check if app is online, if yes run uploadTransaction() function to send all local db data to api
    if(navigator.onLine){
        uploadTransaction();
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

function uploadTransaction() {
    //open a transaction to your db
    const transaction = db.transaction(['new_budget_item'], 'readwrite');

    //access your object store
    const budgetObjectStore = transaction.objectStore('new_budget_item');

    //get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();

    //upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        //if there was data in indexedDb's store, let's send it to the api server
        if(getAll.result.length > 0){
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
            .then(response => response.json())
            then(serverResponse => {
                if(serverResponse.message){
                    throw new Error(serverResponse);
                }
                //open one more transaction 
                const transaction = db.transaction(['new_budget_item'], 'readwrite');
                //access the new budget item object store
                const budgetObjectStore = transaction.objectStore('new_budget_item');
                //clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved budget transactions have been submitted');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};

//listen for app coming back online
window.addEventListener('online', uploadTransaction);