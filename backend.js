//connect MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const connect = "mongodb+srv://admin:admin@cluster0.lciht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" // url from connect module
const client = new MongoClient(connect, { useUnifiedTopology: true } );
//use readline to allow user's input
var readline = require('readline');
var rl = readline.createInterface(
  process.stdin, process.stdout);
const util = require('util');
const question = util.promisify(rl.question).bind(rl);

// create a database in the collections
const dbName = 'mobilePhoneStore';
//use the database 'mobilePhoneStore'
const db = client.db(dbName);

// Use connect method to connect to the server
client.connect(function(err) {
  // using the assert module for testing
  assert.equal(null, err);
  console.log("Connected successfully to server");

  manipulate();
  
});
//For customers and phone items, recorded can be created by input information;
//For orders, first, find a customer by name; find a phone item by model, then create a new record according to the search result;

async function manipulate(){
  // while(sql !== "exit"){
  //   sql = await getSQL();
  //   if(sql !== "exit")
  //   // 
  //   await output(sql);
  // }
  var input = await question("Which entity do you want to manipulate? Please entre a letter.\nC for customers; P for phone items; O for orders.\n");
  if(input === "C" | input === "c"){
    //CRUD for the customer collection
    manipulateCustomer();
  }else if(input === "P" | input === "p"){
    //CRUD for the phone collection
    manipulatePhone();
  }else if(input === "O" | input === "o"){
    //CRUD for the order collection
    manipulateOrder();
  }else{
    console.log("That's not valid. Please try again.")
    manipulate();
  }
}
async function manipulateCustomer(){
  var input = await question("What do you want to do next? Please entre a letter.\nC for create a new record;\nR for search;\nU for update;\nD for delete.\nE for exit.\nPlease create new record first by entering C.\n")
  if(input === "R" | input === "r"){
    //search users 
    findCustomer(db,function(){});
  }else if(input === "U" | input === "u"){
    //update user information
    updateCustomer(db,function(){});
  }else if(input === "D" | input === "d"){
    //delete a record
    deleteCustomer(db,function(){});
  }else if(input === "C" | input === "c"){
    //insert a new piece a record
    insertCustomer(db,function(){});
  }else if(input === "E" | input === "e"){
    manipulate();
  }else{
    console.log("Sorry it's not a valid operator command. Please try again.")
    manipulateCustomer();
  }
}
async function manipulatePhone(){
  var input = await question("What do you want to do next? Please entre a letter.\nC for create a new record;\nR for search;\nU for update;\nD for delete.\nE for exit.\nPlease create new record first by entering C.\n")
  if(input === "R" | input === "r"){
    //search users 
    findPhone(db,function(){});
  }else if(input === "U" | input === "u"){
    //update user information
    updatePhone(db,function(){});
  }else if(input === "D" | input === "d"){
    //delete a record
    deletePhone(db,function(){});
  }else if(input === "C" | input === "c"){
    //insert a new piece a record
    insertPhone(db,function(){});
  }else if(input === "E" | input === "e"){
    manipulate();
  }else{
    console.log("Sorry it's not a valid operator command. Please try again.")
    manipulatePhone();
  }
}
async function manipulateOrder(){
  var input = await question("What do you want to do next? Please entre a letter.\nC for create a new record;\nR for search;\nD for delete.\nE for exit.\nPlease create new record first by entering C.\n")
  if(input === "R" | input === "r"){
    //search users 
    findOrder(db,function(){});
  }else if(input === "D" | input === "d"){
    //delete a record
    deleteOrder(db,function(){});
  }else if(input === "C" | input === "c"){
    //insert a new piece a record
    insertOrder(db,function(){});
  }else if(input === "E" | input === "e"){
    manipulate();
  }else{
    console.log("Sorry it's not a valid operator command. Please try again.")
    manipulateOrder();
  }
}



const insertCustomer = async function(db, callback) {
  // Use the "customers" collection
  const collection = db.collection('customers');
  // Insert one customer;
  var fname = await question("Please input the first name of the customer: ");
  var sname = await question("Please input the surname of the customer: ");
  var title = await question("Please input the title of the customer: ");
  var phoneNumber = await question("Please input the phone number of the customer: ");
  var email = await question("Please input the email address of the customer: ");
  var addline1 = await question("Please input the address of the customer: ");
  var town = await question("Please input the town of the address: ");
  var city = await question("Please input the county/city of the address: ");
  var Eircode = await question("Please input the Eircode: ");
  collection.insertOne(
    {"Title":title,"FirstName":fname,"Surname":sname,"Mobile":phoneNumber,
    "Email":email, "HomeAddress" : 
    {"AddressLine1" :addline1, "AddressLine2": " ", "Town": town, "CountyOrCity": city, "Eircode":Eircode},
    "ShippingAddress" : 
    {"AddressLine1" :addline1, "AddressLine2": " ", "Town": town, "CountyOrCity": city, "Eircode":Eircode}},
  function(err, result) {
    assert.equal(err, null);
    console.log("Inserted 1 customer into the collection.");
    callback(result);
  });
  manipulateCustomer();
}

const insertPhone = async function(db, callback) {
  // Use the "phoneItems" collection
  const collection = db.collection('phoneItems');
  // Insert one phone item;
  var manufacturer = await question("Please input the manufacturer of the phone: ");
  var model = await question("Please input the model of the phone: ");
  var price = await question("Please input the price of the phone: ");
  collection.insertOne(
    {"Manufacturer":manufacturer,"Model":model,"Price":price},
  function(err, result) {
    assert.equal(err, null);
    console.log("Inserted 1 phone item into the collection.");
    callback(result);
  });
  manipulatePhone();
}
const insertOrder = async function(db, callback) {
  var orderNumber = Math.floor(Math.random()*1000000000) + "P";
  // Find the customer and the phone model;
  const cuscollection = db.collection('customers');
  var fname = await question("Please input the first name of the customer: ");
  var sname = await question("Please input the surname of the customer: ");
  
  cuscollection.find({ "FirstName" : fname, "Surname":sname}).toArray(function(err, result) {
    if (err) throw err;
    var customer = result[0];
    insertPhoneToOrder(customer,orderNumber); 
  });
}
async function insertPhoneToOrder(customer,orderNumber){
  // Use the "orders" collection
  const collection = db.collection('orders');
  
  var itemNum = await question("How many phones in this order?");
  var phoneArr = await getMultiPhone(itemNum);
  // Insert into the order;
  collection.insertOne(
    {"orderNumber": orderNumber, "customer":customer,"Phone":phoneArr},
    function(err, result) {
      assert.equal(err, null);
      console.log("Inserted 1 order into the collection.");
    });
    manipulateOrder();
    
}
//allow multi phone items in one order
async function getMultiPhone(number){
  var phoneArr=[];
  for(var i=0; i<number;i++){
    var model = await question("Please input the model of the phone: ");
    var phone = await findOnePhone(model);
    phoneArr = phoneArr.concat(phone);
  }
  return phoneArr;
}
//according to the phone model, find an item to add into the order
async function findOnePhone(model){
  const phonecollection = db.collection('phoneItems');
  const phones = await phonecollection.find({ "Model" : model}).toArray();  
  return phones[0];
}
const findPhone = async function(db, callback) {
  // Using the "phoneItems" collection
  const collection = db.collection('phoneItems');
  //  Fine the phone according to a model;;
  var model = await question("Please input the model name for searching: ");
  var query = { "Model" : model};
  collection.find(query).toArray(function(err, result) {
    if (err) throw err;
    for(var i=0; i<result.length; i++){
      console.log("\nHere is the result: "+result[i].Manufacturer+","+result[i].Model+","+result[i].Price);
    }
  });
  manipulatePhone();
}
const findOrder = async function(db, callback) {
  // Using the "orders" collection
  const collection = db.collection('orders');
  //  Fine the order of a customer according to his/her name;;
  var name = await question("Please input the name of the customer: ");
  var query = {'customer.FirstName':name};
  collection.find(query).toArray(function(err, result) {
    if (err) throw err;
    for(var i=0; i<result.length; i++){
      console.log("\nHere is the result: Order" + (i+1) + ", "+ result[i].customer.FirstName+"  "+result[i].customer.Surname+",");
      for(var j=0; j<result[i].Phone.length;j++){
        console.log(result[i].Phone[j].Manufacturer+","+result[i].Phone[j].Model+","+result[i].Phone[j].Price);

      }
    }
  });
  manipulateOrder();
}
const findCustomer = async function(db, callback) {
  // Using the "customers" collection
  const collection = db.collection('customers');
  // Fine the customer according to a name;
  var name = await question("Please input a name for searching: ");
  var query = { "FirstName" : name};
  collection.find(query).toArray(function(err, result) {
    if (err) throw err;
    for(var i=0;i<result.length;i++){
      console.log("\nHere is the result: "+result[i].Title+" "+result[i].FirstName+" "+result[i].Surname);
      console.log("Mobile : "+result[i].Mobile+"\nEmail : "+result[i].Email);
      console.log("Home Address : "+result[i].HomeAddress.AddressLine1+" "+result[i].HomeAddress.AddressLine2+" "+result[i].HomeAddress.Town+" "+result[i].HomeAddress.CountyOrCity+" "+result[i].HomeAddress.Eircode);
      console.log("Shipping Address : "+result[i].ShippingAddress.AddressLine1+" "+result[i].ShippingAddress.AddressLine2+" "+result[i].ShippingAddress.Town+" "+result[i].ShippingAddress.CountyOrCity+" "+result[i].ShippingAddress.Eircode);
    }
  });
  manipulateCustomer();
}

const deleteCustomer = async function(db, callback) {
  // Using the "customers" collection
  const collection = db.collection('customers');
  // delete the customer which matches the name, phone number and email address;
  var name = await question("Please input the name of the customer that you want to delete: ");
  var phoneNumber = await question("Please input the phone number of the customer that you want to delete: ");
  var email = await question("Please input the email address of the customer that you want to delete: ");
  var query = {FirstName : name, Mobile : phoneNumber, Email : email};
  collection.deleteOne(query, function(err, obj) {
    if (err) throw err;
    console.log("1 record deleted");
  });
  manipulateCustomer();
}
const deletePhone = async function(db, callback) {
  // Using the "phoneItems" collection
  const collection = db.collection('phoneItems');
  // Delete the model;
  var manufacturer = await question("Please input the manufacturer of the phone: ");
  var model = await question("Please input the model of the phone: ");
  var price = await question("Please input the price of the phone: ");
  var query = {Manufacturer : manufacturer, Model : model, Price : price};
  collection.deleteOne(query, function(err, obj) {
    if (err) throw err;
    console.log("1 record deleted");
  });
  manipulatePhone();
}
const deleteOrder = async function(db, callback) {
  // Using the "order" collection
  const collection = db.collection('orders');
  // Fine the order of a customer according to his/her name;;
  var name = await question("Please input the name of the customer: ");
  var query = {'customer.FirstName':name};
  collection.find(query).toArray(function(err, result) {
    if (err) throw err;
    for(var i=0; i<result.length; i++){
      console.log("\nHere is the result: Order number:  " + result[i].orderNumber + ","+ result[i].customer.FirstName+"  "+result[i].customer.Surname+","+result[i].Phone.Manufacturer + " "+ result[i].Phone.Model + " "+result[i].Phone.Price);
    }
  });
  var ordernumber = await question("Which order do you want to delete? Please enter the order number: ");
  var query = {orderNumber: ordernumber};
  //Delete the order according to order number;
  collection.deleteOne(query, function(err, obj) {
    if (err) throw err;
    console.log(obj.deletedCount+ " record deleted");
  });
  manipulateOrder();
}

const updateCustomer = async function(db, callback) {
  // Using the "customers" collection
  const collection = db.collection('customers');
  // Update the customer information;
  var name = await question("Please input the name of the customer that you want to delete: ");
  var query = {FirstName : name};
  var phoneNumber = await question("Please input the new phone number of the customer: ");
  var email = await question("Please input the new email address of the customer: ");
  var title = await question("Please input the new title of the customer: ");
  var newValue = {$set: {Mobile : phoneNumber, Email : email, Title: title}};
  collection.updateOne(query, newValue, function(err, res) {
    if (err) throw err;
    console.log("1 customer updated");
  });
  manipulateCustomer();
}
const updatePhone = async function(db, callback) {
  // Using the "phoneItems" collection
  const collection = db.collection('phoneItems');
  // Update the phone information;
  var manufacturer = await question("Please input the manufacturer of the phone: ");
  var model = await question("Please input the model of the phone: ");
  var query = {Manufacturer : manufacturer, Model : model};
  var price = await question("Please input the new price of this model: ");
  var newValue = {$set: {Price : price}};
  collection.updateOne(query, newValue, function(err, res) {
    if (err) throw err;
    console.log("1 Phone model updated");
  });
  manipulatePhone();
}




var titles = ['Mx',	'Ms',	'Mr',	'Mrs',	'Miss',	'Dr',	'Other'];
function titleGenerator(){
  var index = Math.floor(Math.random() * 7);
  return titles[index];
}
function phoneNumberGenerator(){
  var number = "+";
  for(var i=0;i<13;i++){
    number += Math.floor(Math.random() * 10);
  }
  return number;
}
var addressLine1 = ["Juniper","Ash","Adar","Cedar","Maple","Howth","Berry"];
function address1Generator(){
  var index = Math.floor(Math.random() * 7);
  return "Building "+addressLine1[index];
}

//refer to John's name generator
        // CSO Baby Names of Ireland (https://www.cso.ie/en/interactivezone/visualisationtools/babynamesofireland/)
        var bNames = 
        `Conor
        Daniel
        Adam
        Liam
        Tadhg
        Luke
        Charlie
        Darragh
        Harry
        Ois??n
        Michael
        Alex
        Fionn
        Cillian
        Thomas
        Jamie
        Patrick
        R??an
        Finn
        Se??n
        Oliver
        Ryan
        Dylan
        Matthew
        Ben
        Bobby
        John
        Leo
        Cian
        Aaron
        Max
        Ethan
        Alexander
        Jake
        Tom
        Jacob
        Alfie
        David
        Senan
        Oscar
        Sam
        Callum
        Mason
        Ollie
        Aidan
        Theo
        William
        Leon
        Joseph
        Tommy
        Joshua
        Lucas
        Evan
        Donnacha
        Logan
        Luca
        Samuel
        Nathan
        Cathal
        Shay
        Archie
        Jayden
        George
        Kai
        Andrew
        Louis
        Danny
        Rory
        Theodore
        Freddie
        Eoin
        Benjamin
        Billy
        Hugo
        Muhammad
        Ronan
        Robert
        Arthur
        Kayden
        Christopher
        Henry
        Frankie
        Dara
        Kyle
        Ruair??
        Edward
        Isaac
        Martin
        Odhran
        Eli
        Mark
        Anthony
        Josh
        Zach
        Joey
        Odhr??n
        Kevin
        Tadgh
        Jaxon
        Scott
        Sonny
        Tom??s
        Cormac
        Peter
        Sean
        Eoghan
        Brody
        Shane
        Killian
        Tiernan
        Sebastian
        Carter
        Hunter
        Daith??
        Ciar??n
        Rian
        Teddy
        Tyler
        Arlo
        Gabriel
        Jackson
        Eric
        Cody
        ??anna
        Lorcan
        Alan
        Filip
        Joe
        Elliot
        Rhys
        Oran
        Calvin
        Nicholas
        Blake
        Harrison
        Paddy
        Brian
        Caleb
        Louie
        Harvey
        Cole
        P??id??
        S??an
        Reuben
        Denis
        Ted
        Iarlaith
        Jason
        Donagh
        Elliott
        Riley
        Iarla
        Lewis
        Jordan
        Antoni
        Elijah
        Cooper
        Paul
        Hugh
        Rowan
        Daire
        Gerard
        Keelan
        Kian
        Jonathan
        Jude
        Lukas
        Jakub
        Zack
        Johnny
        Stephen
        Niall
        Charles
        Felix
        Levi
        Bradley
        Fiachra
        Conn
        Zac
        Cameron
        Kacper
        Milo
        D??ire
        D??ith??
        Robbie
        Olly
        Caol??n
        Owen
        Corey
        Oskar
        Conall
        Jan
        Jonah
        Robin
        Mateo
        Adrian
        Shea
        Toby
        Diarmuid
        Myles
        Leonardo
        Ned
        Grayson
        S??amus
        Dean
        Jesse
        Zachary
        Dominic
        P??draig
        Ruadh??n
        Colm
        Richard
        Philip
        Frank
        Will
        Dan
        Christian
        Keegan
        Matteo
        Aodh??n
        Gear??id
        Reece
        Marcel
        Franciszek
        Parker
        Ian
        Noel
        Conan
        Rocco
        Aleksander
        Darius
        Casey
        Jaxson
        Kieran
        Timothy
        Naoise
        Peadar
        Matei
        Kaiden
        F??onn
        Ross
        Colin
        Lennon
        Emmet
        Luka
        Ali
        Mikey
        Maximilian
        Aiden
        Damian
        Art
        Harley
        Finley
        Daragh
        Connor
        Dominik
        Austin
        Caelan
        Jimmy
        Flynn
        Hudson
        C??an
        M??che??l
        Tiarn??n
        Calum
        Lee
        Tristan
        Marcus
        Donal
        Donncha
        Bernard
        Lochlann
        Maksymilian
        Stefan
        Nathaniel
        Julian
        Cayden
        Beau
        Elias
        Lachlan
        Ezra
        Gavin
        Seamus
        Brendan
        Szymon
        Vincent
        Francis
        Ruben
        Ibrahim
        Tobias
        Faol??n
        Brandon
        Darren
        Simon
        Jay
        Caolan
        Hayden
        Victor
        Mikolaj
        Alexandru
        Mohamed
        Andrei
        Andy
        Caiden
        Jace
        Cu??n
        E??in
        Miche??l
        Oisin
        Justin
        Brooklyn
        Kealan
        Frederick
        Seth
        Dawson
        Lochlan
        Odin
        Beauden
        Barry
        Maxim
        Jim
        Roman
        Ahmad
        Luan
        Bruno
        Ralph
        Tymon
        Jasper
        Enzo
        Miles
        Rua
        Ewan
        Ivan
        Troy
        Pearse
        Ferdia
        Jeremiah
        Wiktor
        Diego
        Artur
        Olaf
        Leighton
        Lorenzo
        Culann
        Jayce
        Otis
        E??ghan
        S??
        Dawid
        Morgan
        Mohammad
        Tony
        Nikodem
        Mohammed
        Nicolas
        Cuan
        Malachy
        Caden
        Rafael
        Ellis
        Alec
        Barra
        Paudie
        Lenny
        Reggie
        Sh??a
        Tomas
        Dillon
        Declan
        Kane
        Ashton
        Donnchadh
        Bill
        Albert
        Fabian
        Cristian
        Ayaan
        Quinn
        Brayden
        Kyron
        Tommie
        Tymoteusz
        Ayan
        Brogan
        Carson
        Mylo
        Omar
        Spencer
        Zain
        Nico
        Zion
        Ignacy
        Ruadh
        Gael
        C??an
        D??nal
        Se??n ??g
        S??im??
        Padraig
        Patryk
        Mateusz
        Gary
        Euan
        Olan
        Marco
        Ultan
        Natan
        Oliwier
        Chris
        Piotr
        Tomasz
        Benas
        Eryk
        Domhnall
        Thady
        Axel
        Emanuel
        Rohan
        Asher
        Fiach
        Ailbe
        Bodhi
        Brodie
        Zayn
        Bogdan
        Hamish
        Matias
        Remy
        River
        Albie
        Caoimh??n
        Kyren
        Lorc??n
        ??dhran
        Micheal
        Tiarnan
        Michal
        Davin
        Jeremy
        Kajus
        Hubert
        Hamza
        Pedro
        Leonard
        Ajay
        Matt
        Maximus
        Raphael
        Syed
        Eduard
        Milan
        Rio
        Wyatt
        Emmett
        Freddy
        Tajus
        Yusuf
        Jenson
        Kody
        Teodor
        ??is??n
        Sen??n
        Steven
        Damien
        Eamon
        Neil
        Eamonn
        Joel
        Roan
        Ahmed
        Laurence
        Warren
        Erik
        Karol
        Pauric
        Emil
        Mike
        Miguel
        Rayan
        Abdul
        Dennis
        Jonas
        Terence
        Cain
        Kristian
        Kyran
        Marko
        Eden
        Kaylum
        Lochlainn
        Lucca
        Braxton
        Arijus
        Karson
        Rayyan
        Avery
        Kayson
        Cro??
        Fion??n
        P??draic
        S??adna
        Ace
        Ciaran
        Ruairi
        Marc
        Riain
        Emmanuel
        Travis
        Raymond
        Bartosz
        Bailey
        Glenn
        Jerry
        Aron
        Gregory
        Turlough
        Abel
        Eddie
        Krzysztof
        Xavier
        Wojciech
        Markus
        Regan
        Ricky
        Amir
        Kylan
        Luis
        Mustafa
        Nataniel
        Viktor
        Malik
        Rion
        Walter
        Zane
        Aronas
        Alessio
        Darach
        Heath
        Koby
        Mannix
        Markas
        Phoenix
        Rares
        Cruz
        Iosua
        John-Paul
        Marley
        Seamie
        Vlad
        Jordi
        Koa
        Olivers
        Lugh
        Mj
        Fionn??n
        Maiti??
        ??lan
        Ult??n
        Sean??n
        Oakley
        Daithi
        Karl
        Bryan
        Pierce
        Kamil
        Olivier
        Mathew
        Conal
        Zak
        Aran
        Nikita
        Preston
        Roy
        Igor
        Devin
        Mario
        Abdullah
        Andre
        Feidhlim
        Maksim
        Nojus
        Devon
        Gerry
        Maurice
        Stanislaw
        Byron
        Cal
        Dominick
        Dominykas
        Aryan
        Callan
        Christy
        Con
        Cullen
        Danielius
        Fred
        Hassan
        Kaleb
        Kalvin
        Anas
        Beniamin
        Ephraim
        Ruan
        Timmy
        Alistair
        Erick
        Abraham
        Bobbie
        Bruce
        Coby
        Davi
        Dorian
        Evanas
        Haris
        Hughie
        Macdara
        Miley
        Moise
        Nikolas
        Richie
        Benny
        Constantin
        Dalton
        Herkus
        Iarfhlaith
        Kenny
        Kobi
        Kylian
        Musa
        Noa
        Timas
        Tudor
        Rico
        Karter
        Ari
        Henryk
        Zayan
        Kaiser
        Kit
        P??raic
        R??n??n
        Jax
        Craig
        Shaun
        Matas
        Clayton
        Kenneth
        Tim
        Saul
        Daryl
        Gareth
        Maxwell
        Seanan
        Cailum
        Larry
        Emilis
        Jody
        Keenan
        Aedan
        Allan
        Fynn
        Jaiden
        Raul
        Alfred
        Angelo
        Cahir
        Chulainn
        Culainn
        Giovanni
        Guy
        Jia
        Kajetan
        Lincoln
        Milosz
        Orin
        Pavel
        Quin
        Zayd
        Barney
        Borys
        Dexter
        Ezekiel
        Franklin
        Aarav
        Aodh
        Kasper
        Ksawery
        Layton
        Rodrigo
        Rogan
        Sonnie
        Tommy Lee
        Tommy-Lee
        Youssef
        Zaid
        Zakaria
        Azlan
        Caolin
        Dario
        Eyad
        Gabriels
        Gene
        Idris
        Ishaan
        Jj
        Jonathon
        Kevins
        Lughaidh
        Mathias
        Mohamad
        Santiago
        Setanta
        Timur
        Valentin
        Vladimir
        Yahya
        Yaseen
        Coen
        Denver
        Mieszko
        Vihaan
        Alby
        Colby
        Damir
        Thiago
        Tyson
        Yousuf
        Clark
        Donnie
        Cobi
        Jakov
        Kiaan
        Advik
        Aod??n
        Azaan
        Bernardo
        Brad??n
        Cad??n
        Clay
        ??ran
        R??nan
        Ru??n
        Se??nie
        Sunny
        Th??o
        Ruaidhr??
        Lawson
        Kaison
        Laoch
        Yazan
        Or??n
        P??dhraic
        T J
        Teid??
        C????n
        Denny
        Benett
        Aris
        Boston
        Br??n
        Glen
        Enda
        Aodhan
        Fintan
        Padraic
        Desmond
        Finlay
        Rossa
        Antonio
        Zachariah
        Diarmaid
        Kilian
        Dion
        Finian
        Kornel
        Marcos
        Trevor
        Terry
        Carlos
        Damon
        Jared
        Kaden
        Malachi
        Russell
        Sami
        Solomon
        Wesley
        Aleks
        Anton
        Dwayne
        Enrico
        Erikas
        Felim
        Gabrielius
        Jarlath
        Jerome
        Kallum
        Lennox
        Roberto
        Rui
        Samson
        Taha
        Cohen
        Don
        Geordan
        Isaiah
        Johan
        Jon
        Kade
        Keagan
        Kurt
        Manus
        Micah
        Remi
        Roger
        Theodor
        Tiago
        Torin
        Xander
        Alejandro
        Aleksandr
        Amos
        Blaise
        Caine
        Dante
        Elvis
        Eunan
        Harris
        Jakob
        Jamal
        Joris
        Adomas
        Aj
        Arjun
        Artem
        Asa
        Ashley
        Bowie
        Casper
        Colton
        Cuinn
        Denas
        Domas
        Douglas
        Fletcher
        Franek
        Jensen
        Korey
        Lucian
        Malcolm
        Matej
        Neitas
        Nolan
        Rex
        Rylan
        Rylee
        Safwan
        Sebastien
        Steve
        Teo
        Tobiasz
        Umar
        Antony
        Arnold
        Augustas
        Ayman
        Cezary
        Connie
        Darby
        Dhruv
        Dominiks
        Donald
        Finbar
        Isac
        Israel
        Jozef
        Kaelan
        Kenzo
        Kodi
        Lleyton
        Marius
        Matheus
        Mihai
        Miracle
        Quentin
        Reginald
        Reid
        Roland
        Sameer
        Sidney
        T.J.
            Timotei
        Usman
        Yassin
        Ammar
        Archer
        Axl
        Breffni
        Arham
        Kobe
        Rob
        Sawyer
        Affan
        Jad
        Judah
        Kason
        Ziggy
        Bryson
        Cade
        Cill??an
        Con??n
        ??amonn
        Reyansh
        R??
        R??ain
        Rohaan
        Younis
        Llewyn
        Malek
        S??adhna
        Seb
        Reign
        Reon
        Knox
        Vincenzo
        Ri??n
        Magnus
        R??oghan
        Ron??n
        Klayton
        Mikaeel
        Samy
        C J
        Alonzo
        C??n??n
        Daimh??n
        Evaan
        Feidhelm
        F??ilim
        Beckett
        Br??on
        Afonso
        Forrest
        Eliezer
        D??mhnall
        Jem
        Casian`.split(/\n/);

        // CSO Baby Names of Ireland (https://www.cso.ie/en/interactivezone/visualisationtools/babynamesofireland/)
        var gNames = 
        `Emily
        Grace
        Fiadh
        Sophie
        Hannah
        Amelia
        Ava
        Ellie
        Ella
        Mia
        Lucy
        Emma
        Lily
        Olivia
        Chloe
        Aoife
        Caoimhe
        Molly
        Anna
        Sophia
        Holly
        Freya
        Saoirse
        Kate
        Sadie
        Robyn
        Katie
        Ruby
        Evie
        ??abha
        Cara
        Sarah
        Isabelle
        Isla
        Alice
        Leah
        Sadhbh
        Eva
        Erin
        R??is??n
        Zoe
        Sofia
        Zara
        Willow
        Charlotte
        Lauren
        Jessica
        Faye
        Ciara
        Clodagh
        Millie
        Isabella
        Eve
        Niamh
        Maya
        Layla
        Ada
        Rosie
        Abigail
        Julia
        Clara
        Maisie
        Amy
        Maria
        Aria
        Alannah
        Annie
        Harper
        Aoibh??n
        Emilia
        Amber
        Bonnie
        Mila
        Heidi
        Ailbhe
        Bella
        Abbie
        Ivy
        Aoibheann
        Rose
        Sienna
        Elizabeth
        Georgia
        Rebecca
        Laura
        Ellen
        M??abh
        Alexandra
        Kayla
        Isabel
        Hollie
        Mary
        ??ine
        Aisling
        Hazel
        Rachel
        Tara
        Evelyn
        Megan
        Doireann
        Daisy
        Hanna
        Lara
        Mollie
        Maeve
        Sara
        Lilly
        Luna
        Victoria
        Hailey
        Hayley
        Poppy
        F??adh
        Zoey
        Penny
        Pippa
        Ayla
        Ayda
        Nina
        Annabelle
        Penelope
        Indie
        Alanna
        Maja
        Paige
        Lola
        Naoise
        Cora
        Matilda
        Elsie
        Laoise
        Nora
        Lexi
        Eleanor
        Hallie
        Lottie
        Aoibhe
        Ruth
        Lena
        Phoebe
        Nicole
        Eimear
        Jane
        S??ofra
        Si??n
        Brooke
        Mya
        Gracie
        Summer
        Tess
        Eliza
        Caitlin
        Alison
        Darcie
        Esm??
        Madison
        Lucia
        Maggie
        Callie
        Muireann
        Beth
        Kathleen
        Tessa
        Cro??a
        Aoibhinn
        Jasmine
        Isobel
        Juliette
        Savannah
        Riley
        Caragh
        Kara
        Stella
        Liliana
        Ariana
        Florence
        Darcy
        Esme
        R??ona
        Zuzanna
        Bridget
        Nadia
        Gabriela
        Aurora
        ??ala
        R??ise
        Kayleigh
        Cassie
        Elena
        Anastasia
        Nevaeh
        Alicia
        Aaliyah
        Allie
        Scarlett
        Naomi
        Margaret
        Maia
        Elise
        Farrah
        Katelyn
        Shauna
        Orla
        Aimee
        Vanessa
        Alana
        Natalia
        Rhea
        Skye
        April
        Alicja
        Nancy
        Mae
        Arabella
        Keeva
        Aoibh
        Robin
        Pearl
        Eden
        Remi
        Taylor
        Alisha
        Catherine
        Casey
        Nessa
        Lacey
        Thea
        Iris
        Maddison
        Tilly
        Bl??ith??n
        Lydia
        Zofia
        Nell
        Amelie
        Teagan
        Alyssa
        Helena
        Juliet
        Lia
        Beatrice
        Cadhla
        Fia
        Edie
        Harley
        Violet
        Oliwia
        Jade
        Melissa
        Sally
        Elle
        Leila
        Aisha
        Gabriella
        Addison
        Maryam
        Elodie
        Frankie
        Gr??inne
        Alex
        Diana
        Daria
        Kyra
        Ana
        Lana
        Lillie
        Norah
        Belle
        Quinn
        ??adaoin
        Orlaith
        Erica
        Faith
        Libby
        Lillian
        Lyla
        Harriet
        Arya
        Cali
        Ellie-Mae
        Nova
        Skylar
        Aoibh??nn
        Abby
        Jennifer
        Michaela
        Ali
        Claire
        Yasmin
        Dearbhla
        Lucie
        Piper
        Bl??thnaid
        Cl??odhna
        ??na
        Eabha
        Sorcha
        Andrea
        Kelsey
        Rosa
        Francesca
        Aliyah
        Klara
        Mabel
        Lila
        Bailey
        Emmie
        Kaia
        Nela
        Skyler
        Rois??n
        Sin??ad
        Danielle
        Aleksandra
        Amanda
        Bronagh
        Darcey
        Ema
        Hope
        Antonia
        Saibh
        Juno
        Margot
        S??omha
        Moya
        Stephanie
        Christina
        Martha
        Carly
        Marie
        Maebh
        Ria
        Alisa
        Mariam
        Miriam
        Evelina
        Elisa
        Connie
        Billie
        Liadh
        Pola
        May
        Avery
        Priya
        Ariella
        Myla
        Louise
        Joanna
        Ally
        Annabel
        Cleo
        Eloise
        Vivienne
        Dara
        Gloria
        Kali
        Eliana
        Zahra
        Maisy
        Maci
        Cro??adh
        Heather
        Claudia
        Aideen
        Ann
        Elisha
        Bethany
        Joy
        Sadbh
        Meghan
        Andreea
        Marta
        Arianna
        Halle
        Iseult
        Ayesha
        Myah
        Aya
        Emelia
        Kylie
        Aurelia
        Alba
        Harlow
        Indy
        Kenzie
        Khloe
        Lilah
        Saorlaith
        Valentina
        Adeline
        Dani
        Haniya
        Stevie
        Seoid??n
        Shannon
        Jodie
        Kelly
        Wiktoria
        Jenna
        Ashley
        Karolina
        Sasha
        Fatima
        Helen
        Keela
        Natalie
        Beibhinn
        Meadhbh
        Weronika
        Erika
        Imogen
        Angelina
        Winnie
        Amira
        Aida
        Milana
        Autumn
        Marcelina
        Reina
        Rylee
        Michelle
        Leona
        Fiona
        Meabh
        Carla
        Kaitlyn
        Brianna
        Kacey
        Nikola
        Samantha
        Linda
        Sandra
        Serena
        Veronica
        Eileen
        Johanna
        Lauryn
        Madeleine
        Louisa
        Laragh
        Milena
        Izabella
        Paula
        Bianca
        Alessia
        Annalise
        Olive
        Ceoladh
        Edith
        Ryleigh
        Sonia
        Anaya
        Bowie
        Vada
        Eibhl??n
        Esm??e
        Tori
        Gabrielle
        Julie
        Angel
        Lexie
        Lea
        Una
        Neasa
        Demi
        Karina
        Esther
        Pia
        Emilija
        Leyla
        Martina
        Anne
        Daniela
        Rosemary
        Jessie
        Kyla
        Maura
        Seren
        Mai
        Polly
        Kornelia
        Selena
        Delia
        Ellie-May
        Giulia
        Kitty
        Dakota
        Ella-Mae
        Lily-Mae
        Maddie
        Melody
        Sofija
        Blake
        June
        Philippa
        Caitl??n
        ??rlaith
        R??ilt??n
        Zo??
        S??ne
        Alaia
        Abbey
        Emer
        Patricia
        Charley
        Ailish
        Paulina
        Alexa
        Caoilinn
        Eilish
        Emilie
        Jamie
        Greta
        Makayla
        Mary-Kate
        Adele
        Christine
        Kaya
        Miya
        Eryn
        Lina
        Amina
        Elisabeth
        Gianna
        Irene
        Izabela
        Kaylee
        Lily-Rose
        Aifric
        Alma
        Bobbi
        Ellie-Mai
        Gaia
        Lois
        Alia
        Dorothy
        Drew
        Georgie
        Lilianna
        Melisa
        Aubrey
        Ida
        Kyah
        Rayna
        Stefania
        Everleigh
        Everly
        Wynter
        Chlo??
        Mair??ad
        Nicola
        Lisa
        Rachael
        Chantelle
        Sabrina
        Laila
        Charlie
        Melanie
        Caitlyn
        Klaudia
        Deborah
        Angela
        Stacey
        Nia
        Tianna
        Zainab
        Teresa
        Celine
        Nelly
        Saorla
        Aliya
        Judith
        Lili
        Neala
        Paris
        Alise
        Amna
        Anya
        Leia
        Mackenzie
        Selina
        Winifred
        Amalia
        Adah
        Adelina
        Agnes
        Alayna
        Amara
        Amaya
        Ella-Rose
        Indi
        Joni
        Liana
        Macie
        Melania
        Noor
        Rebeca
        Rowan
        Syeda
        Ayra
        Beatrix
        Fallon
        Freyja
        Noreen
        Vayda
        Harleigh
        Winter
        Aibh??n
        B??ibhinn
        Br??d
        C??it
        ??irinn
        ??de
        M??ire
        Nains??
        N??ra
        ??rla
        R??alt??n
        Sib??al
        ??rin
        Shona
        Keira
        Aoibhin
        Martyna
        Kirsten
        Katherine
        Tia
        Caroline
        Gabija
        Jorja
        Daniella
        India
        Susan
        Clare
        Enya
        Caoilainn
        Adriana
        Kiara
        Madeline
        Samara
        Kimberly
        Vanesa
        Alexia
        Milly
        Aoileann
        Hayleigh
        Kira
        Hana
        Livia
        Alva
        Anais
        Darci
        Dora
        Gwen
        Kaja
        Maud
        Rosanna
        Wendy
        Alina
        Alix
        Allison
        Ameila
        Anastazja
        Khadija
        Kiya
        Lavinia
        Aiza
        Arwen
        Aubree
        Averie
        Barbara
        Celeste
        Eibhlin
        Eshaal
        Ines
        Jasmina
        Josie
        Kalina
        Leja
        Miley
        Minnie
        Talia
        Theodora
        Yasmina
        Bella-Rose
        Brooklyn
        Delilah
        Eila
        Emmi
        Gia
        Ioana
        Lukne
        Marianna
        Myra
        Nel
        Raina
        Serah
        Tillie
        Yara
        Ellie mae
        Adaline
        Effie
        Faya
        Paisley
        Tuiren
        Aodhla
        Essie
        Aim??e
        Ariyah
        Ayat
        Cl??ona
        Evelin
        Mirha
        Ren??e
        Fi??dh
        Leanne
        Chelsea
        Nadine
        Avril
        Josephine
        Carrie
        Kamila
        Lorna
        Simone
        Dawn
        Jenny
        Kathryn
        Sive
        Gabriele
        Kaci
        Tiffany
        Magdalena
        Mikayla
        Alexandria
        Antonina
        Katy
        Fionnuala
        Jana
        Jess
        Katrina
        Philomena
        Estera
        Iga
        Joyce
        Julianna
        Kimberley
        Larissa
        Patricija
        Sofie
        Yusra
        Camelia
        Carmen
        Carolina
        Emmanuella
        Honor
        Lainey
        Alexis
        Audrey
        Bria
        Ebony
        Emile
        Hailie
        Honey
        Lidia
        Adela
        Adelaide
        Amelia-Rose
        Amirah
        Anabelle
        Ela
        Elia
        Elina
        Ellie-Rose
        Emmy
        Isha
        Jannat
        Kaiya
        Karlie
        Kendall
        Kourtney
        Kyrah
        Lily Mae
        Lyra
        Malwina
        Mara
        Marnie
        Miah
        Migle
        Moira
        Nika
        Reagan
        Soraya
        Thalia
        Treasa
        Vivien
        Afric
        Alena
        Ariah
        Atene
        Athena
        Betty
        Constance
        Darla
        Diya
        Eman
        Fatimah
        Flora
        Giorgia
        Jayda
        Kady
        Kaelyn
        Kora
        Leen
        Liepa
        Lilli
        Liv
        Maisey
        Marwa
        Meadow
        Mina
        Mira
        Miruna
        Olivija
        Oonagh
        Poppie
        Raya
        Remy
        Rena
        Riadh
        Roxanne
        Shelby
        Sommer
        Teodora
        Zoya
        Noa
        Meara
        Romi
        Harlee
        Esmai
        Saileog
        Sloane
        C??ra
        Er??n
        J??lia
        Lilith
        Lylah
        Reya
        R??adh
        Rua
        Se??na
        Sh??na
        L??le
        Siana
        Mealla
        Sia
        Rylie
        Peig??
        Molla??
        Luc??a
        Se??na
        Aylah
        Alys
        C??ara
        C??ala
        Damaris
        Blossom
        F??ile
        Aadhya
        ??ila
        ??ire
        Sinead
        Gemma
        Abi
        Keelin
        Kellie
        Cliona
        Tegan
        Karen
        Sharon
        Kiera
        Alesha
        Shania
        Deirdre
        Joanne
        Kasey
        Toni
        Dominika
        Orlagh
        Caoilfhionn
        Kayley
        Kerrie
        Noelle
        Valerie
        Genevieve
        Julianne
        Noemi
        Zarah
        Bernadette
        Meg
        Princess
        Tamara
        Teegan
        Agata
        Brigid
        Denise
        Kaitlin
        Mary Kate
        Rhiannon
        Rita
        Sylvia
        Teigan
        Theresa
        Aela
        Aleena
        Elsa
        Marina
        Michalina
        Tiana
        Celina
        Destiny
        Elaina
        Haley
        Iman
        Isolde
        Olwyn
        Rebeka
        Samira
        Sefora
        Tabitha
        Ailis
        Alissa
        Astrid
        Bebhinn
        Caela
        Cecelia
        Ekaterina
        Eunice
        Evanna
        Frances
        Izzy
        Kallie
        Luiza
        Mallaidh
        Matylda
        Adina
        Amaia
        Amelija
        Arisha
        Asia
        Ayah
        Bianka
        Blanka
        Camilla
        Caoileann
        Cassidy
        Cindy
        Ella May
        Ella Rose
        Fae
        Gaja
        Hafsa
        Ina
        Inaaya
        Izabelle
        Lilla
        Luisa
        Luka
        Macy
        Manuela
        Marika
        Milla
        Molly Mae
        Petra
        Peyton
        Pixie
        Raisa
        Riah
        Shayla
        Susanna
        Sylvie
        Teja
        Tierna
        Urszula
        Viktoria
        Zoja
        Allegra
        Anabia
        Ananya
        Andra
        Anika
        Anna Rose
        Annabella
        Arina
        Beatriz
        Blair
        Bobbie
        Caelyn
        Dalia
        Darya
        Elianna
        Emilee
        Emily-Rose
        Emmeline
        Esmay
        Estela
        Feena
        Hanorah
        Ilinca
        Indiana
        Iqra
        Kaitlynn
        Karly
        Kiyah
        Laya
        Lilly-May
        Lori
        Luana
        Malika
        Marin
        Meadbh
        Mona
        Montana
        Nella
        Pennie
        Radha
        Raven
        Rawan
        Rida
        Riya
        Roseanne
        Salome
        Sana
        Shae
        Suzie
        Tabita
        Tasneem
        Trinity
        Viola
        Zaina
        Zosia
        Esmae
        Joanie
        Alayah
        Della
        Perrie
        Naya
        Nola
        Ail??s
        Aodha
        B??bhinn
        Br??d??n
        Br??nagh
        Cl??dagh
        ??ile
        Eil??s
        R??onach
        Ro??s??n
        S??le
        Siobh??n
        Xenia
        Mayla
        Rh??a
        Rheia
        L??ana
        Mayar
        Zara-Rose
        Zimal
        Rafaela
        Saylor
        Mei
        Sof??a
        Teona
        Theadora
        Kenzi
        Kataleya
        Neansa??
        Lyanna
        Marlowe
        Raiya
        Veda
        Mahnoor
        Selin
        Maram
        Melany
        Yuval
        Areen
        ??ada
        Ava Grace
        ??riu
        Aviana
        Alaya
        Aibhil??n
        Ecaterina
        Bl??th??n
        Bodhi
        Anna May
        Alondra
        ??adha
        Eim??le
        A??fe
        Aliana
        Amelia Rose
        Cr??oa
        Adia
        Cro??
        D??ire
        Dallas
        Anays
        Ivy-Rose`.split(/\n/);

        // Top 100 Irish Surnames (https://www.swilson.info/topsurnames.php)
        var sNames = 
        `Murphy
        Kelly
        Sullivan
        Walsh
        Smith
        Byrne
        Ryan
        Connor
        Reilly
        Doyle
        McCarthy
        Gallagher
        Doherty
        Kennedy
        Lynch
        Murray
        Quinn
        Moore
        McLaughlin
        Carroll
        Connolly
        Daly
        Connell
        Wilson
        Dunne
        Brennan
        Burke
        Collins
        Campbell
        Clarke
        Johnston
        Hughes
        Farrell
        Fitzgerald
        Brown
        Martin
        Maguire
        Nolan
        Flynn
        Thompson
        Callaghan
        Duffy
        Mahony
        Boyle
        Healy
        Shea
        White
        Sweeney
        Hayes
        Kavanagh
        Power
        McGrath
        Moran
        Brady
        Stewart
        Casey
        Foley
        Fitzpatrick
        Leary
        McDonnell
        McMahon
        Donnelly
        Regan
        Donovan
        Burns
        Flanagan
        Mullan
        Barry
        Kane
        Robinson
        Cunningham
        Griffin
        Kenny
        Sheehan
        Ward
        Whelan
        Lyons
        Reid
        Graham
        Higgins
        Cullen
        Keane
        King
        Maher
        McKenna
        Bell
        Scott
        Hogan
        Keeffe
        Magee
        McNamara
        McDonald
        McDermott
        Moloney
        Rourke
        Buckley
        Dwyer`.split(/\n/);

        // merge boys and girls names-remove duplication
        // maybe could have used (must check!):
        // = Array.from(new Set(bNames.concat(...gNames)))
        var fNames = [...new Set([...bNames, ...gNames])];

        // set up protytype for random selection from array
        Array.prototype.sample = function () {
            return this[Math.floor(Math.random() * this.length)];
        }

        // set up array shuffle using Fisher-Yates method
        Array.prototype.shuffle = function () {
            var i = this.length, j, temp;
            if (i == 0) return this;
            while (--i) {
                j = Math.floor(Math.random() * (i + 1));
                temp = this[i];
                this[i] = this[j];
                this[j] = temp;
            }
            return this;
        }

        // get a random name
        function getRandomFirstName() {
            return fNames.sample().trim();
        }
        function getRandomSurName() {
          return sNames.sample().trim();
        }
        
        // shuffle the boys and girls names (and surnames ... sure why not!)
        fNames.shuffle(); sNames.shuffle();
