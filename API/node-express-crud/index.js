import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.

//Creo l'objecte de l'aplicació
const app=express(); // conte totes les funcionalitats es decir, inicia el servidor (init)
app.use(bodyParser.json())

const readData=()=>{
    try{
        const data=fs.readFileSync("./db.json");
        //console.log(data);
        //console.log(JSON.parse(data));
        return JSON.parse(data)

    }catch(error){
        console.log(error);
    }
};
//Funció per escriure informació
const writeData=(data)=>{
    try{
        fs.writeFileSync("./db.json",JSON.stringify(data));

    }catch(error){
        console.log(error);
    }
}
//Funció per llegir la informació
//readData();
//Els endpoint son verbs http (get, post, put, delete)
app.get("/",(req,res)=>{
    res.send("Wellcome to my first API with Node.js");
});

//Creem un endpoint per obtenir tots els llibres
app.get("/books",(req,res)=>{
    const data=readData();
    res.json(data.books);
})
//Creem un endpoint per obtenir un llibre per un id
app.get("/books/:id",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);//esta sentencia guarda lo que pasa por la url (el id)
    const book=data.books.find((book)=>book.id===id);
    res.json(book); // esta es la respuesta respuesta
})

//Creem un endpoint del tipus post per afegir un llibre

app.post("/books",(req,res)=>{ //post = insert
    const data=readData();
    const body=req.body; // define el cuerpo de la peticion
    //todo lo que viene en ...body se agrega al nuevo libro
    const newBook={
        id:data.books.length+1,
        ...body, //propagació fa una copia del body 
    };
    data.books.push(newBook); //genera un nuevo elemento 
    const {name}= req.body;
    console.log("Titol del llibre: ",name);
    writeData(data);
    res.json(newBook);
});

//Creem un endpoint per modificar un llibre


app.put("/books/:id", (req, res) => {
    const data = readData(); //lee la informacion del array
    const body = req.body;
    const id = parseInt(req.params.id); //guarda el valor del id 
    const bookIndex = data.books.findIndex((book) => book.id === id); //busca el id dentro del array
    data.books[bookIndex] = { // modifica el array gracias a la ubicacion del id ubicado antes
      ...data.books[bookIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Book updated successfully" });
  });

//Creem un endpoint per eliminar un llibre
app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    //splice esborra a partir de bookIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.books.splice(bookIndex, 1); //esplice -> posicionarse en el index proporcionado recorta una posicion de la posicion indicada
    writeData(data);
    res.json({ message: "Book deleted successfully" });
  });

//Funció per escoltar
app.listen(3000,()=>{
    console.log("Server listing on port 3000");
});