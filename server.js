const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const FILE_PATH = 'users.xlsx';
const REGISTER_PATH = 'register.xlsx';
let workbook;
let registerWorkbook;
if (fs.existsSync(FILE_PATH)) {
    workbook = xlsx.readFile(FILE_PATH);
} else {
    workbook = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([['Name', 'Email', 'Password']]);
    xlsx.utils.book_append_sheet(workbook, ws, 'Users');
    xlsx.writeFile(workbook, FILE_PATH);
}
if(fs.existsSync(REGISTER_PATH)){
    registerWorkbook = xlsx.readFile(REGISTER_PATH);
}
else{
    registerWorkbook = xlsx.utils.book_new();
    const ws1 = xlsx.utils.aoa_to_sheet([['Name', 'Email', 'Roll No', 'Branch', 'Year']]);
    xlsx.utils.book_append_sheet(registerWorkbook, ws1, 'Users');
    xlsx.writeFile(registerWorkbook, REGISTER_PATH);
}

const saveWorkbook = () => xlsx.writeFile(workbook, FILE_PATH);
let info;
app.post('/signup', (req, res) => {
    const { name, email, password, cnfpassword } = req.body;
    const ws = workbook.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(ws);
    const user = users.some(u => u.Email === email);
    if(user){
        res.status(400).send('Email already in use');
    }
    else{
        if(password === cnfpassword){
            if(String(password).length>7){
                const newUser = [name, email, password];
                xlsx.utils.sheet_add_aoa(ws, [newUser], { origin: -1 });
                saveWorkbook();
                info = email;
                res.status(200).send(`Welcome ${name}!`)
            }else{
                res.status(401).send('Password must contain atleat 8 characters')
            }
        }
        else{
            res.status(401).send('Please recheck the password')
        }
    }  
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const ws = workbook.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(ws);
    const user = users.find(u => u.Email === email && u.Password === password);
    if (user) {
        info = email;
        res.status(200).json({ message: 'Welcome!', name: user.Name });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

const saveregisterWorkbook = () => xlsx.writeFile(registerWorkbook, REGISTER_PATH);
app.post('/register', (req, res) =>{
    const {name, email, rollno, branch, year} = req.body;
    const ws1 = registerWorkbook.Sheets['Users'];
    const users1 = xlsx.utils.sheet_to_json(ws1);
    const user1 = users1.find(u => u.Email === email);
    if (user1) {
        res.status(401).send('Email already in use');
    }
    else{
        const newUser1 = [name, email, rollno, branch, year];
        xlsx.utils.sheet_add_aoa(ws1, [newUser1], { origin: -1 });
        saveregisterWorkbook();
        res.status(200).send('Welcome!')
    }
});

app.get('/message', (req, res) => {
    res.send(info);
  });

app.post('/join', (req, res) =>{
    const {token} = req.body;
});

const EXCEL_FILE = 'link.xlsx';
app.post('/create', (req, res) =>{
    const workbook = xlsx.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length <= 1) {
        return res.status(404).json({ message: "No more strings" });
    }
    const string = data[1][0];
    const updatedData = [data[0], ...data.slice(2)];
    const newWorksheet = xlsx.utils.aoa_to_sheet(updatedData);
    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, EXCEL_FILE);

    res.json({ string });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
